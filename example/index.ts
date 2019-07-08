import dotenv = require('dotenv');
import express = require('express');
dotenv.config();

const app = express();

import lib = require('../src');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

const locationSearch = lib.antwerpen.locationSearchController({
    solrGisAuthorization: process.env.SOLR_GIS_AUTHORIZATION,
    solrGisUrl: process.env.SOLR_GIS_URL,
    crabUrl: process.env.CRAB_URL
});
app.get('/api/locations', locationSearch);

const coordinateSearch = lib.antwerpen.coordinateSearchController({
    arcGisUrl: process.env.ARC_GIS_URL
});
app.get('/api/coordinates', coordinateSearch);

const VlaanderencoordinateSearch = lib.vlaanderen.coordinateSearchController({
    gisUrl: process.env.VLAANDEREN_GIS_URL
});
app.get('/api/vlaanderen/coordinates', VlaanderencoordinateSearch);

const VlaanderenLocationSearch = lib.vlaanderen.locationSearchController({
    locationUrl: process.env.VLAANDEREN_LOCATION_URL,
    locationPoiUrl: process.env.VLAANDEREN_LOCATION_URL_POI,
    locationIdUrl: process.env.VLAANDEREN_LOCATION_URL_ID
});

app.get('/api/vlaanderen/locations', VlaanderenLocationSearch);

const port = process.env.PORT || 9999;
app.listen(port, () =>
    console.log('Example app listening on port ' + port + '!')
);
