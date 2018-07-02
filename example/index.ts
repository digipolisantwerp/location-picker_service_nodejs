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

var locationSearch = lib.antwerpen.locationSearchController({
    solrGisAuthorization: process.env.SOLR_GIS_AUTHORIZATION,
    solrGisUrl: process.env.SOLR_GIS_URL,
    crabUrl: process.env.CRAB_URL
})

app.get('/api/locations', locationSearch);

var coodinateSearch = lib.antwerpen.coordinateSearchController({
    crabUrl: process.env.CRAB_URL,
    openSpaceUrl: process.env.OPEN_SPACE_URL,
    mobilityUrl: process.env.MOBILITY_URL,
    regionalRoadUrl: process.env.REGIONAL_ROAD_URL
})

app.get('/api/coordinates', coodinateSearch)

const port = process.env.PORT || 9999;
app.listen(port, () =>
    console.log('Example app listening on port ' + port + '!')
);
