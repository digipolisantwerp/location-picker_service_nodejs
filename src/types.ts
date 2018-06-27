export interface LocationItem {
    /** the unique of of this location */
    id: string;
    /** the user-visible name of this location */
    name: string;
    /** the street name, if any */
    street?: string;
    /** the street address number (not a number, may contain letters) */
    number?: string;
    /** the street postal (not a number, may contain letters) */
    postal?: string;
    /** the type of location item this is, number means street address */
    locationType: LocationType;
    /** the layer that the result came from (in the underlying data repository) */
    layer?: string;
    /** the coordinates of this location */
    coordinates?: {
        latLng?: LatLngCoordinate;
        lambert?: LambertCoordinate;
    };

    polygons?: LatLngCoordinate[][];
}

export interface LambertCoordinate {
    x: number;
    y: number;
}

export interface LatLngCoordinate {
    lat: number;
    lng: number;
}

export enum LocationType {
    Street = "STREET",
    Number = "NUMBER",
    Poi = "POI",
    Park = "PARK",
    BicycleRoute = "BICYCLEROUTE"
}
