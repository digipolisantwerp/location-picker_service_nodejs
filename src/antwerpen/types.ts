export interface CoordinateServiceConfig {
    /** URL of the address API */
    openSpaceUrl: string;
    /** URL of the address API */
    mobilityUrl: string;
    /** URL of the CRAB address API */
    crabUrl: string;
    /** URL of the regional road address API */
    regionalRoadUrl: string;
}

export interface LocationServiceConfig {
    /** URL of the SOLR GIS search API */
    solrGisUrl: string;
    /** Authorization key for the SOLR GIS search API */
    solrGisAuthorization: string;
    /** URL of the CRAB address API */
    crabUrl: string;
}
