export interface LocationItem {
    /** the unique id of this location */
    id: string;
    /** the user-visible name of this location */
    name: string;
    /** the street name, if any */
    street?: string;
    /** the street address number (not a number, may contain letters) */
    number?: string;
    /** the street postal (not a number, may contain letters) */
    postal?: string;
    /** the city district this street is in (if known) */
    district?: string;
    /** the type of location item this is, number means street address */
    locationType: LocationType;
    /** the layer that the result came from (in the underlying data repository) */
    layer?: string;
    /** the coordinates of this location */
    coordinates?: Coordinates;
    /** the polygon of this location */
    polygons?: LatLngCoordinate[][];
}

export interface Coordinates {
    latLng?: LatLngCoordinate;
    lambert?: LambertCoordinate;
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
    Street = "street",
    Number = "number",
    Poi = "poi",
    Park = "park",
    BicycleRoute = "bicycleroute",
    RegionalRoad = "regionalroad"
}
