import requestPromise = require("request-promise");
import filterSqlVar from '../../helpers/filterSqlVar';
import { handleResponse, handleResponseFn } from '../../helpers/handleResponse';
import lambertToLatLng from '../../helpers/lambertToLatLng';
import { LatLngCoordinate, LocationItem, LocationType } from '../../types';
import { CoordinateServiceConfig } from '../types';
import * as Promise from 'bluebird';

export class CoordinateService {
    private config: CoordinateServiceConfig

    constructor(config: CoordinateServiceConfig) {
        this.config = config;
    }

    public getLocation(lng: number = 0.0, lat: number = 0.0): Promise<LocationItem> {
        return this.getPark(lng, lat)
            .then((park: LocationItem) => {
                // if a park is found, return the park
                if (park) {
                    return Promise.resolve(park);
                }

                return this.getNearAddress(lng, lat, 20)
                    .then((position: LocationItem) => {
                        if (position) {
                            return Promise.resolve(position);
                        }

                        return this.getStreet(lng, lat);
                    });
            });
    }

    private getPark(lng: number = 0.0, lat: number = 0.0): Promise<LocationItem> {
        return this.getPointWithin(lng, lat, 0, 21, this.config.openSpaceUrl)
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
    }

    private getNearAddress(lng: number = 0.0, lat: number = 0.0, range: number = 20): Promise<LocationItem> {
        return this.reverseGeocode(lng, lat, range)
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
    }

    private getStreet(lng: number = 0.0, lat: number = 0.0, range: number = 5): Promise<LocationItem> {
        return this.getPointNearby(lng, lat, range, this.config.crabUrl)
            .then((response: any) => {
                if (!response) {
                    return Promise.resolve(undefined);
                }
                //TODO PARSE TO CORRECT FORMAT
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
    }

    private getBicycle(lng: number = 0.0, lat: number = 0.0): Promise<LocationItem> {
        return this.getPointWithin(lng, lat, 20, 6, this.config.mobilityUrl)
            .then((response: any) => {
                if (!response) {
                    return Promise.resolve(undefined);
                }
                //TODO PARSE TO CORRECT FORMAT
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
    }

    private getPointWithin(lng: number = 0.0, lat: number = 0.0, tolerance: number = 0, layerIds: number = 0, layerUrl: string) {
        const url = "https://querybylocation.antwerpen.be/querybylocation/pointwhitin" +
            "?url=" + layerUrl +
            "&sr=4326" +
            "&tolerance=" + tolerance +
            "&layerids=" + layerIds +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(this.getRequestOptions(url));
    }

    private reverseGeocode(lng: number = 0.0, lat: number = 0.0, range: number = 20) {
        const url = "https://reversedgeocode-a.antwerpen.be/api/ReservedGeocoding/GetAntwerpAdresByPoint" +
            "?sr=4326" +
            "&count=20" +
            "&buffer=" + range +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(this.getRequestOptions(url));
    }

    private getPointNearby(lng: number = 0.0, lat: number = 0.0, range: number = 5, layerUrl: string) {
        const url = "https://querybylocation.antwerpen.be/querybylocation/pointnearby" +
            "?url=" + layerUrl +
            "&sr=4326" +
            "&tolerance=0" +
            "&range=" + range +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(this.getRequestOptions(url));
    }

    private getRequestOptions(url: string, auth?: string) {
        return {
            method: 'GET',
            url,
            json: true,
            headers: auth ? {
                Authorization: `Basic ${auth}`
            } : {}
        };
    }
}
