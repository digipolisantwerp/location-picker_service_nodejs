import requestPromise = require("request-promise");
import filterSqlVar from '../../helpers/filterSqlVar';
import { handleResponse, handleResponseFn } from '../../helpers/handleResponse';
import lambertToLatLng from '../../helpers/lambertToLatLng';
import { LatLngCoordinate, LocationItem, LocationType } from '../../types';
import { CoordinateServiceConfig } from '../types';
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
export = function createCoordinateService(config: CoordinateServiceConfig):
    (lng: number, lat: number) => Promise<LocationItem> {

    const getPark = (lng: number = 0.0, lat: number = 0.0): Promise<LocationItem> => {
        const url = "https://querybylocation.antwerpen.be/querybylocation/pointwhitin" +
            "?url=" + config.queryUrl +
            "&sr=4326" +
            "&tolerance=0" +
            "&layerids=21" +
            "&x=" + lng +
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
                    name: doc.attributes.STRAAT + (doc.attributes.HUISNR ? ('' + doc.attributes.HUISNR) : ''),
                    street: doc.attributes.STRAAT,
                    number: doc.attributes.HUISNR,
                    postal: doc.attributes.POSTCODE,
                    locationType: LocationType.Park,
                    polygons: rings.map((ring: any[]) => {
                        return ring.map((x: any[]) => {
                            if (x.length < 1) {
                                return undefined;
                            }

                            return {
                                lng: x[1],
                                lat: x[0]
                            };
                        })
                            // filter out the undefined values
                            .filter((x) => x)
                    })
                };

                return Promise.resolve(result);
            });
    };

    const getPointWithin = (lng: number = 0.0, lat: number = 0.0, range: number = 20): Promise<LocationItem> => {
        const url = "https://reversedgeocode-a.antwerpen.be/api/ReservedGeocoding/GetAntwerpAdresByPoint" +
            "?sr=4326" +
            "&count=20" +
            "&buffer=" + range +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(getRequestOptions(url))
            .then((response: any) => {
                if (!response || !response.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response[0];
                const { x, y } = doc.xy;
                const latLng = lambertToLatLng(x, y);
                const result: LocationItem = {
                    id: '' + doc.straatnmid,
                    name: doc.straatnm + (doc.huisnr ? (' ' + doc.huisnr) : ''),
                    street: doc.straatnm,
                    number: doc.huisnr,
                    postal: doc.postcode,
                    locationType: LocationType.Street,
                    coordinates: {
                        latLng,
                        lambert: { x, y }
                    }
                };

                return Promise.resolve(result);
            });
    };

    const getNearby = (lng: number = 0.0, lat: number = 0.0, range: number = 5): Promise<LocationItem> => {
        const url = "https://querybylocation.antwerpen.be/querybylocation/pointnearby" +
            "?url=" + config.queryUrl +
            "&sr=4326" +
            "&tolerance=0" +
            "&range=" + range +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(getRequestOptions(url))
            .then((response: any) => {
                if (!response || !response.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response[0];
                const result: LocationItem = {
                    id: '' + doc.straatnmid,
                    name: doc.straatnm + (doc.huisnr ? (' ' + doc.huisnr) : ''),
                    street: doc.straatnm,
                    number: doc.huisnr,
                    postal: doc.postcode,
                    locationType: LocationType.Street
                };

                return Promise.resolve(result);
            });
    };

    return (lng: number = 0.0, lat: number = 0.0): Promise<LocationItem> => {
        return getPark(lng, lat)
            .then((park: LocationItem) => {
                // if a park is found, return the park
                if (park) {
                    return Promise.resolve(park);
                }

                return getPointWithin(lng, lat, 20)
                    .then((position: LocationItem) => {
                        if (position) {
                            return Promise.resolve(position);
                        }

                        return getNearby(lng, lat);
                    });
            });
    };
}
