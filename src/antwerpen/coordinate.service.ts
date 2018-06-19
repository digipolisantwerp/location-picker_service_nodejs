import request = require('request');
import filterSqlVar from '../helpers/filterSqlVar';
import { handleResponse, handleResponseFn } from '../helpers/handleResponse';
import lambertToLatLng from '../helpers/lambertToLatLng';
import { LatLngCoordinate, LocationItem } from '../types';
import { CoordinateServiceConfig } from './types';

const getStreetAndNr = (search: string = '') => {
    const parts = search.split(' ');
    const result = {
        street: '',
        num: '',
    };

    parts.forEach((part, index) => {
        const matches = /^[0-9]/.exec(part);
        if ((index > 0) && matches) {
            if (!!result.num || matches.index === 0) {
                result.num += part + '';
                return;
            }
        }
        if (result.street) {
            result.street += ' ';
        }
        result.street += part;
    });

    return result;
};

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

const sortByNameFn = (a: LocationItem, b: LocationItem) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase());

/**
 * Create a function that calls the CRAB and SOLR services and finds locations
 *
 * matching a search string and for a specific set of location types (street, number, poi)
 */
export function createCoordinateService(config: CoordinateServiceConfig):
    (lon: number, lat: number) => Promise<LocationItem[]> {

    return (lon: number = 0.0, lat: number = 0.0): Promise<LocationItem[]> => {
        return Promise.resolve([]);
    };
};
