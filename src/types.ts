export interface LocationItem {
    /** the unique of of this location */
    id: string,
    /** the user-visible name of this location */
    name: string,
    /** the street name, if any */
    street?: string,
    /** the street address number (not a number, may contain letters) */
    number?: string,
    /** the type of location item this is, number means street address */
    locationType: "street" | "number" | "poi",
    /** the layer that the result came from (in the underlying data repository) */
    layer?: string,
    /** the coordinates of this location */
    coordinates?: {
        latLng?: LatLngCoordinate,
        lambert?: LambertCoordinate
    }
}

export interface LambertCoordinate {
    x: number,
    y: number
}

export interface LatLngCoordinate {
    lat: number,
    lng: number
}
