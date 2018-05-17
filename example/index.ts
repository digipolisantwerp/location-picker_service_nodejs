import express = require('express')
require('dotenv').config();

const app = express()

const lib = require('../src');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/locations', lib.antwerpen.createController({
    solrAuthorization: process.env.SOLR_GIS_AUTHORIZATION,
    solrGisUrl: process.env.SOLR_GIS_URL,
    crabUrl: process.env.CRAB_URL
}));

const port = process.env.PORT || 9999;
app.listen(port, () => 
    console.log('Example app listening on port ' + port + '!'))
