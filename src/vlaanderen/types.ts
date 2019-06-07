export interface CoordinateServiceConfig {
    gisUrl: string;
}
export interface LocationServiceConfig {
    locationUrl: string;
    locationPoiUrl?: string;
    locationIdUrl?: string;
}
export interface LocationQuery {
    search?: string;
    types?: string[];
    id?: string;
}
