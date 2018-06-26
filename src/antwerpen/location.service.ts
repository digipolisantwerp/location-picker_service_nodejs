import request = require('request');
import filterSqlVar from '../helpers/filterSqlVar';
import { handleResponse, handleResponseFn } from '../helpers/handleResponse';
import lambertToLatLng from '../helpers/lambertToLatLng';
import { LatLngCoordinate, LocationItem, LocationType } from '../types';
import { LocationServiceConfig } from './types';

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
export function createLocationService(config: LocationServiceConfig):
    (search: string, types: string) => Promise<LocationItem[]> {

    const getAddress = (street: string, num: string, callback: handleResponseFn<LocationItem>) => {

        // quotes need to be doubled for escaping into sql
        street = encodeURIComponent(filterSqlVar(street).replace(/'/g, "''"));
        num = encodeURIComponent(filterSqlVar(num));
        const url = config.crabUrl +
            "?f=json&orderByFields=HUISNR&where=GEMEENTE='Antwerpen' and " +
            `STRAATNM='${street}' and HUISNR='${num}' ` +
            "and APPTNR='' and BUSNR=''&outFields=*";
        const responseHandler = handleResponse('features', (doc: any): LocationItem => {
            const { x, y } = doc.geometry;
            const latLng = lambertToLatLng(x, y);
            return {
                id: '' + doc.attributes.ID,
                name: doc.attributes.STRAATNM + ' ' + doc.attributes.HUISNR,
                street: doc.attributes.STRAATNM,
                number: doc.attributes.HUISNR,
                locationType: LocationType.Number,
                layer: 'CRAB',
                coordinates: {
                    latLng,
                    lambert: { x, y }
                }
            };
        }, callback);

        request(getRequestOptions(url), responseHandler);
    };

    const getLocationsBySearch = (
        search: string, types: string[], callback: handleResponseFn<LocationItem>) => {

        search = filterSqlVar(search);
        if (!types.includes('poi')) {
            search = `layer:straatnaam AND ${search}`;
        } else if (!types.includes('street')) {
            search = `NOT layer:straatnaam AND ${search}`;
        }
        const url = config.solrGisUrl +
            '?wt=json&rows=5&solrtype=gislocaties&dismax=true&bq=exactName:DISTRICT^20000.0' +
            '&bq=layer:straatnaam^20000.0' + `&q=(${encodeURIComponent(search)})`;
        const responseHandler = handleResponse('response.docs', (doc: any): LocationItem => {
            let latLng: LatLngCoordinate;
            const { x, y } = doc;
            if (x && y) {
                latLng = lambertToLatLng(x, y);
            }
            const isStreet = doc.layer === 'straatnaam';
            const result: LocationItem = {
                id: doc.key,
                name: doc.name,
                layer: doc.layer,
                locationType: isStreet ? LocationType.Street : LocationType.Poi,
                coordinates: {
                    latLng,
                    lambert: { x, y }
                }
            };
            if (isStreet) {
                result.street = doc.name;
            }
            return result;
        }, callback);

        request(getRequestOptions(url, config.solrGisAuthorization), responseHandler);
    };

    return (search: string, types: string = 'street,number,poi'): Promise<LocationItem[]> => {
        return new Promise((resolve, reject) => {
            const callback = (error: any, result: LocationItem[]) => {
                if (result) {
                    result = result.sort(sortByNameFn);
                }
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            };
            try {
                const { street, num } = getStreetAndNr(search);
                const typesArray = types.split(',');
                if (!!num && typesArray.includes('number')) {
                    getAddress(street, num, callback);
                } else if (typesArray.includes('poi') || typesArray.includes('street')) {
                    getLocationsBySearch(search, typesArray, callback);
                } else {
                    resolve([]);
                }
            } catch (e) {
                reject(e);
            }
        });
    };
}
