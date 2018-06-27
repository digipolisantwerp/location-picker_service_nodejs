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

    // CASCADE to find place
    // 1) check if the location is a park
    // 2) check if the location is a bicycle route
    // 3) check if the location is a street
    // 4) use reverse geocode as a last resort to match it with a location

    public getLocation(lat: number = 0.0, lng: number = 0.0): Promise<LocationItem> {
        return this.getPark(lat, lng)
            .then((park: LocationItem) => {
                // if a park is found, return the park
                if (park) {
                    return Promise.resolve(park);
                }

                return this.getBicycleRoute(lat, lng)
                    .then((route: LocationItem) => {
                        if (route) {
                            return Promise.resolve(route);
                        }
                        return this.getStreet(lat, lng)
                            .then((street: LocationItem) => {
                                if (street) {
                                    return Promise.resolve(street);
                                }

                                return this.getNearestAddress(lat, lng);
                            });
                    });
            });
    }

    private getPark(lat: number = 0.0, lng: number = 0.0): Promise<LocationItem> {
        const tolerance = 0;
        const layerId = 21;
        return this.getPointWithin(lng, lat, tolerance, layerId, this.config.openSpaceUrl)
            .then((response: any) => {
                if (!response || !response.results || !response.results.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response.results[0];
                const { rings } = doc.geometry;
                const result: LocationItem = {
                    id: '' + doc.attributes.OBJECTID,
                    name: doc.attributes.STRAAT + (doc.attributes.HUISNR ? (' ' + doc.attributes.HUISNR) : ''),
                    street: doc.attributes.STRAAT,
                    number: doc.attributes.HUISNR,
                    postal: doc.attributes.POSTCODE,
                    locationType: LocationType.Park,
                    polygons: rings ? rings.map((ring: any[]) => {
                        return ring.map((x: any[]) => {
                            if (x.length < 1) {
                                return undefined;
                            }

                            return {
                                lat: x[1],
                                lng: x[0]
                            };
                        })
                            // filter out the undefined values
                            .filter((x) => x);
                    }) : []
                };

                return Promise.resolve(result);
            });
    }

    private getBicycleRoute(lat: number = 0.0, lng: number = 0.0): Promise<LocationItem> {
        const range = 100;
        const layerId = 6;
        return this.getPointNearby(lng, lat, range, this.config.mobilityUrl)
            .then((response: any) => {
                if (!response || !response.results || !response.results.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response.results[0];
                const { paths } = doc.geometry;
                const result: LocationItem = {
                    id: '' + doc.attributes.ObjectID,
                    name: doc.attributes.STRAAT + (doc.attributes.HUISNR ? (' ' + doc.attributes.HUISNR) : ''),
                    street: doc.attributes.STRAAT,
                    number: doc.attributes.HUISNR,
                    postal: doc.attributes.postcode_links,
                    locationType: LocationType.BicycleRoute,
                    polygons: paths ? paths.map((ring: any[]) => {
                        return ring.map((x: any[]) => {
                            if (x.length < 1) {
                                return undefined;
                            }

                            return {
                                lat: x[1],
                                lng: x[0]
                            };
                        })
                            // filter out the undefined values
                            .filter((x) => x);
                    }) : []
                };

                return Promise.resolve(result);
            });
    }

    private getStreet(lat: number = 0.0, lng: number = 0.0): Promise<LocationItem> {
        const range = 10;
        return this.getPointNearby(lng, lat, range, this.config.crabUrl)
            .then((response: any) => {
                if (!response || !response.features || !response.features.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response.features[0];
                const { x, y } = doc.geometry;
                const result: LocationItem = {
                    id: '' + doc.attributes.OBJECTID,
                    name: doc.attributes.STRAATNM + (doc.attributes.HUISNR ? (' ' + doc.attributes.HUISNR) : ''),
                    street: doc.attributes.STRAATNM,
                    number: doc.attributes.HUISNR,
                    postal: doc.attributes.POSTCODE,
                    locationType: LocationType.Street,
                    coordinates: {
                        latLng: {
                            lat: x,
                            lng: y
                        }
                    }
                };

                return Promise.resolve(result);
            });
    }

    private getNearestAddress(lat: number = 0.0, lng: number = 0.0): Promise<LocationItem> {
        const range = 100;
        return this.reverseGeocode(lng, lat, range)
            .then((response: any) => {
                if (!response || !response.length) {
                    return Promise.resolve(undefined);
                }

                const doc = response[0];
                const { x, y } = doc.xy;
                const result: LocationItem = {
                    id: '' + doc.straatnmid,
                    name: doc.straatnm + (doc.huisnr ? (' ' + doc.huisnr) : ''),
                    street: doc.straatnm,
                    number: doc.huisnr,
                    postal: doc.postcode,
                    locationType: LocationType.Street,
                    coordinates: {
                        latLng: {
                            lat: x,
                            lng: y
                        }
                    }
                };

                return Promise.resolve(result);
            });
    }

    private getPointWithin(lat: number = 0.0, lng: number = 0.0, tolerance: number = 0, layerIds: number = 0, layerUrl: string) {
        const url = "https://querybylocation.antwerpen.be/querybylocation/pointwhitin" +
            "?url=" + layerUrl +
            "&sr=4326" +
            "&tolerance=" + tolerance +
            "&layerids=" + layerIds +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(this.getRequestOptions(url));
    }

    private reverseGeocode(lat: number = 0.0, lng: number = 0.0, range: number = 20) {
        const url = "https://reversedgeocode-p.antwerpen.be/api/ReservedGeocoding/GetAntwerpAdresByPoint" +
            "?sr=4326" +
            "&count=20" +
            "&buffer=" + range +
            "&x=" + lng +
            "&y=" + lat;

        return requestPromise(this.getRequestOptions(url));
    }

    private getPointNearby(lat: number = 0.0, lng: number = 0.0, range: number = 5, layerUrl: string) {
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
