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
    (lon: number, lat: number) => Promise<LocationItem[]> {

    const getPark = (lon: number = 0.0, lat: number = 0.0): Promise<LocationItem[]> => {
        const url = "https://querybylocation-a.antwerpen.be/querybylocation/pointwhitin" +
            "?url=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Open_ruimte/Mapserver/identify" +
            "&sr=4326" +
            "&tolerance=3" +
            "&layerids=21" +
            "&x=" + lon +
            "&y=" + lat;

        return requestPromise(getRequestOptions(url))
            .then(() => {
                return Promise.resolve([]);
            })
    }

    return (lon: number = 0.0, lat: number = 0.0): Promise<LocationItem[]> => {
        return getPark(lon, lat);
    };
};
