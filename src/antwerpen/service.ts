import request = require('request');
import { LocationItem, LatLngCoordinate } from '../types';
import lambertToLatLng from '../helpers/lambertToLatLng';
import { handleResponse, handleResponseFn } from '../helpers/handleResponse';
import { ServiceConfig } from './types';
import filterSqlVar from '../helpers/filterSqlVar';

const getStreetAndNr = (search: string = '') => {
    const parts = search.split(' ');
    const result = {
        street: '',
        number: '',
    };

    parts.forEach((part, index) => {
        const matches = /^[0-9]/.exec(part);
        if ((index > 0) && matches) {
            if (!!result.number || matches.index === 0) {
                result.number += part + '';
                return;
            }
        }
        if (result.street) result.street += ' ';
        result.street += part;
    });

    return result;
}

const getRequestOptions = (url: string, auth?: string) => {
    return {
        method: 'GET',
        url: url,
        json: true,
        headers: auth ? {
            'Authorization': `Basic ${auth}`
        } : {}
    };
}

/**
 * Create a function that calls the CRAB and SOLR services and finds locations
 * 
 * matching a search string and for a specific set of location types (street, number, poi)
 */
export = function createService(config: ServiceConfig):
    (search: string, types: string) => Promise<LocationItem[]> {

    const getAddress = (
        street: string, number: string, callback: handleResponseFn<LocationItem>) => {

        // quotes need to be doubled for escaping into sql
        street = encodeURIComponent(filterSqlVar(street).replace(/'/g, "''"));
        number = encodeURIComponent(filterSqlVar(number));
        const url = config.crabUrl +
            "?f=json&orderByFields=HUISNR&where=GEMEENTE='Antwerpen' and " +
            `STRAATNM='${street}' and HUISNR='${number}' ` + 
            "and APPTNR='' and BUSNR=''&outFields=*";
        const responseHandler = handleResponse('features', (doc: any): LocationItem => {
            const { x, y } = doc.geometry;
            const latLng = lambertToLatLng(x, y);
            return {
                id: '' + doc.attributes.ID,
                name: doc.attributes.STRAATNM + ' ' + doc.attributes.HUISNR,
                street: doc.attributes.STRAATNM,
                number: doc.attributes.HUISNR,
                locationType: 'number',
                layer: 'CRAB',
                coordinates: {
                    latLng,
                    lambert: { x, y }
                }
            };
        }, callback);

        request(getRequestOptions(url), responseHandler);
    }

    const getLocationsBySearch = (
        search: string, types: Array<string>, callback: handleResponseFn<LocationItem>) => {

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
            return {
                id: doc.key,
                name: doc.name,
                layer: doc.layer,
                street: isStreet ? doc.name : null,
                locationType: isStreet ? 'street' : 'poi',
                coordinates: {
                    latLng,
                    lambert: { x, y }
                }
            }
        }, callback);

        request(getRequestOptions(url, config.solrGisAuthorization), responseHandler);
    }

    return (search: string, types: string = 'street,number,poi'): Promise<LocationItem[]> => {
        return new Promise((resolve, reject) => {
            const callback = (error: any, result: LocationItem[]) => {
                if (error) { 
                    reject(error); 
                } else {
                    resolve(result);
                }
            }
            try {
                const { street, number } = getStreetAndNr(search);
                const typesArray = types.split(',');
                if (!!number && typesArray.includes('number')) {
                    getAddress(street, number, callback);
                } else if (typesArray.includes('poi') || typesArray.includes('street')) {
                    getLocationsBySearch(search, typesArray, callback);
                } else {
                    resolve([]);
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}
