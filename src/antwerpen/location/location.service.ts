import request = require("request");
import filterSqlVar from "../../helpers/filterSqlVar";
import { handleResponse, handleResponseFn } from "../../helpers/handleResponse";
import lambertToLatLng from "../../helpers/lambertToLatLng";
import { LocationItem, LocationType, Coordinates, LatLngCoordinate } from "../../types";
import { LocationServiceConfig } from "../types";

const getStreetAndNr = (search: string = "") => {
    const result = {
        street: "",
        num: "",
    };
    // split into street name and number
    const parts = search.split(" ");
    parts.forEach((part, index) => {
        const matches = /[0-9]$/.exec(part);
        if ((index > 0) && matches) {
            if (!!result.num || matches.index === 0) {
                result.num += part + "";
                return;
            }
        }
        if (result.street) {
            result.street += " ";
        }
        // checks if last part contains number at the end
        if (/\d$/.test(part) && ((index + 1) === parts.length)) {
            result.num = part.replace(/^[0-9]\-[a-z]+/g, '');
            result.street += part.replace(/\d*$/, '');
        } else {
            result.street += part;
        }
    });

    // strip district from street name (e.g. " (Deurne)")
    result.street = result.street.trim().replace(/\s+\([a-z\s\,]+\)$/gi, "");

    // check if street contains numbers at the end and removes those numbers
    if (/[a-z]\d*$/.test(result.street)) {
        result.street = result.street.replace(/[0-9]*$/g, '');
    }

    // makes sure the number field doesn't contain the street and removes spaces
    result.num = search.replace(result.street, '').replace(/\s/g, '');

    // strip district from num field in case it's there (For some reason it gets into the num field in some cases)
    result.num = result.num.trim().replace(/^\([a-z\s\,]*\)/gi, "");
    return result;
};

const getRequestOptions = (url: string, auth?: string) => {
    return {
        method: "GET",
        url,
        json: true,
        headers: auth
            ? {
                  Authorization: `Basic ${auth}`,
              }
            : {},
    };
};

const sortByNameFn = (a: LocationItem, b: LocationItem) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());

/**
 * Create a function that calls the CRAB and SOLR services and finds locations
 *
 * matching a search string and for a specific set of location types (street, number, poi)
 */
export = function createLocationService(
    config: LocationServiceConfig,
): (search: string, types: string) => Promise<LocationItem[]> {
    const getAddress = (street: string, num: string, callback: handleResponseFn<LocationItem>) => {
        // quotes need to be doubled for escaping into sql
        street = encodeURIComponent(filterSqlVar(street).replace(/'/g, "''"));
        num = encodeURIComponent(filterSqlVar(num));
        const url =
            config.crabUrl +
            "?f=json&orderByFields=HUISNR&where=GEMEENTE='Antwerpen' and " +
            `STRAATNM LIKE '${street}%' and HUISNR='${num}' ` +
            "and APPTNR='' and BUSNR=''&outFields=*";
        const responseHandler = handleResponse('features', (doc: any): LocationItem => {
            const { x, y } = doc.geometry;
            const latLng = lambertToLatLng(x, y);
            let nameFormat = doc.attributes.STRAATNAAM + ' ' + doc.attributes.HUISNR;
            nameFormat +=  ', ' + doc.attributes.POSTCODE + ' ' + doc.attributes.DISTRICT;
            return {
                id: '' + doc.attributes.ID,
                name: nameFormat,
                street: doc.attributes.STRAATNM,
                number: doc.attributes.HUISNR,
                postal: doc.attributes.POSTCODE,
                district: doc.attributes.DISTRICT,
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

    const getLocationsBySearch = (search: string, types: string[], callback: handleResponseFn<LocationItem>) => {
        search = filterSqlVar(search);
        if (!types.includes("poi")) {
            search = `layer:straatnaam AND ${search}`;
        } else if (!types.includes("street")) {
            search = `NOT layer:straatnaam AND ${search}`;
        }
        const url =
            config.solrGisUrl +
            "?wt=json&rows=5&solrtype=gislocaties&dismax=true&bq=exactName:DISTRICT^20000.0" +
            "&bq=layer:straatnaam^20000.0" +
            `&q=(${encodeURIComponent(search)})`;

        const responseHandler = handleResponse(
            "response.docs",
            (doc: any): LocationItem => {
                let coordinates: Coordinates;
                if (doc && (doc.x || doc.y)) {
                    coordinates = {
                        lambert: { x: doc.x, y: doc.y },
                        latLng: lambertToLatLng(doc.x, doc.y),
                    };
                }

                let polygons = Array<LatLngCoordinate[]>();
                if (doc && doc.geometry) {
                    try {
                        const geometry = JSON.parse(doc.geometry);
                        if (geometry[0].length > 0) {
                            const geometry2d = doc.geometry[0];
                            polygons = geometry.map((p: any[]) => {
                                return p.map((xy: any[]) => {
                                    if (xy.length < 2) {
                                        return undefined;
                                    }

                                    const x = xy[0];
                                    const y = xy[1];
                                    return lambertToLatLng(x, y);
                                });
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }

                const isStreet = doc.layer === "straatnaam";
                const result: LocationItem = {
                    id: doc.id,
                    name: doc.name,
                    layer: doc.layer,
                    locationType: isStreet ? LocationType.Street : LocationType.Poi,
                    coordinates,
                    polygons,
                };
                if (isStreet) {
                result.street = doc.name;
                result.streetid = doc.streetNameId;
            }
                if (doc.districts && doc.districts.length) {
                const district = doc.districts[0];
                if (typeof district === "string") {
                    result.district = district;
                    result.name += " (" + district + ")";
                }
                result.postal = doc.POSTCODE;
                result.district = doc.DISTRICT;
            }
                return result;
        }, callback);

        request(getRequestOptions(url, config.solrGisAuthorization), responseHandler);
    };

    return (search: string, types: string = "street,number,poi"): Promise<LocationItem[]> => {
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
                const typesArray = types.split(",");
                // look for a specific address (with number)
                if (!!num && typesArray.includes("number")) {
                    getAddress(street, num, callback);
                    // look for a street or point of interest (without number)
                } else if (typesArray.includes("poi") || typesArray.includes("street")) {
                    getLocationsBySearch(street, typesArray, callback);
                } else {
                    resolve([]);
                }
            } catch (e) {
                reject(e);
            }
        });
    };
};
