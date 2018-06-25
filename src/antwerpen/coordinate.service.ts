import requestPromise = require("request-promise");
import merc = require("mercator-projection");
import filterSqlVar from '../helpers/filterSqlVar';
import { handleResponse, handleResponseFn } from '../helpers/handleResponse';
import lambertToLatLng from '../helpers/lambertToLatLng';
import { LatLngCoordinate, LocationItem } from '../types';
import { CoordinateServiceConfig } from './types';
import * as Promise from 'bluebird';

const getRequestOptions = (url: string, auth?: string) => {
    return {
        method: 'GET',
        url,
        json: true,
        headers: auth ? {
            Authorization: `Basic ${auth}`
        } : {}
    };
};

/**
 * Create a function that calls the CRAB and SOLR services and finds locations
 *
 * matching a search string and for a specific set of location types (street, number, poi)
 */
export function createCoordinateService(config: CoordinateServiceConfig):
    (lon: number, lat: number) => Promise<LocationItem> {

    const getPark = (lon: number = 0.0, lat: number = 0.0): Promise<LocationItem> => {
        const url = "https://querybylocation-a.antwerpen.be/querybylocation/pointwhitin" +
            "?url=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Open_ruimte/Mapserver/identify" +
            "&sr=4326" +
            "&tolerance=0" +
            "&layerids=21" +
            "&x=" + lon +
            "&y=" + lat;

        return requestPromise(getRequestOptions(url))
            .then((response: any) => {
                if (!response || !response.results || !response.results.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response.results[0];
                const { rings } = doc.geometry;
                const result: LocationItem = {
                    id: '' + doc.attributes.OBJECTID,
                    name: doc.attributes.STRAAT + (doc.attributes.HUISNR ?  ('' + doc.attributes.HUISNR) : ''),
                    street: doc.attributes.STRAAT,
                    number: doc.attributes.HUISNR,
                    postal: doc.attributes.POSTCODE,
                    locationType: 'street',
                    polygon: rings.map(ring => {
                        return ring.map(x => {
                            if(x.length < 1) {
                                return undefined;
                            }

                            return {
                                lon: x[1],
                                lat: x[0]
                            };
                        })
                        // filter out the undefined values
                        .filter(x => x)
                    })
                };

                return Promise.resolve(result);
            });
    };

    return (lon: number = 0.0, lat: number = 0.0): Promise<LocationItem> => {
        return getPark(lon, lat)
        .then((park) => {
            // if a park is found, return the park
            if(park) {
                return Promise.resolve(park)
            }
            // else continue to look for a value

        });
    };
}
