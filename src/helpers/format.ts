import lambertToLatLng from "./lambertToLatLng";
import { LocationItem, LocationType, Coordinates, LatLngCoordinate } from "../types";

const formatAddress = (doc: any): LocationItem => {
    const { x, y } = doc.geometry;
    const latLng = lambertToLatLng(x, y);
    const { STRAATNAAM, STRAATNM, HUISNR, POSTCODE, DISTRICT } = doc.attributes;
    const nameFormat = `${STRAATNAAM} ${HUISNR}, ${POSTCODE} ${DISTRICT}`;

    return {
        id: '' + doc.attributes.ID,
        name: nameFormat,
        street: STRAATNM,
        number: HUISNR,
        postal: POSTCODE,
        district: DISTRICT,
        locationType: LocationType.Number,
        layer: 'CRAB',
        coordinates: {
            latLng,
            lambert: { x, y }
        },
        streetid: doc.attributes.STRAATNMID
    };
};

const formatLocationItem = (doc: any): LocationItem => {
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
};

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

export {
    formatAddress,
    formatLocationItem,
    getStreetAndNr,
};
