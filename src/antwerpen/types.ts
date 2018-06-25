export interface CoordinateServiceConfig {
    query_by_location_url: string;
}

export interface LocationServiceConfig {
    /** URL of the SOLR GIS search API */
    solrGisUrl: string;
    /** Authorization key for the SOLR GIS search API */
    solrGisAuthorization: string;
    /** URL of the CRAB address API */
    crabUrl: string;
}
