# Location Picker Smart Widget BFF (Node)

This is a Node.js backend service library to create a BFF service for the Location Picker Smart Widget. The widget provides a picker field to choose a street, street address or point of interest from GIS sources. This service is matched by a [corresponding UI](https://github.com/digipolisantwerp/location-picker_widget_angular).

There is a **demo service**, see below for instructions on running it.

For a version history, including list of changes, check the [changelog](CHANGELOG.md).

## How to use

### Installing

Copy the .npmrc file from this repo to your application's folder.

Then install (you will need to be on the digipolis network):

```sh
> npm install @acpaas-ui-widgets/nodejs-location-picker
```

### Using

Express example:

```js
const express = require('express');
const app = express()
const pickerHelper = require('@acpaas-ui-widgets/nodejs-location-picker');
var locationSearch = lib.antwerpen.locationSearchController({
    solrGisAuthorization: process.env.SOLR_GIS_AUTHORIZATION,
    solrGisUrl: process.env.SOLR_GIS_URL,
    crabUrl: process.env.CRAB_URL
})

app.get('/api/locations', locationSearch);

var locationSearch = lib.antwerpen.coordinateSearchController({
    crabUrl: process.env.CRAB_URL,
    openSpaceUrl: process.env.OPEN_SPACE_URL,
    mobilityUrl: process.env.MOBILITY_URL,
    regionalRoadUrl: process.env.REGIONAL_ROAD_URL
})

app.get('/api/coordinates', locationSearch)
app.listen(9999);
```

The default SOLR endpoint (esb-app1-p) listed above does not require authorization, so you can leave the solrGisAuthorization property blank when using that url.

The library provides the following interface:

- antwerpen
  - *locationSearch(config)*: create an express controller that handles the connection to the data sources for locations in Antwerpen.
  - *coordinateSearch(config)*: create an express controller that handles the connection to the data sources for coordinates in Antwerpen.

## Run the demo app

Create a .env file containing:

```sh
PORT=9999
SOLR_GIS_URL=https://esb-app1-p.antwerpen.be/v1/giszoek/solr/search
SOLR_AUTHORIZATION=
CRAB_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query
OPEN_SPACE_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Open_ruimte/Mapserver/identify
MOBILITY_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Mobiliteit/MapServer/6/query
REGIONAL_ROAD_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/basisdata/Mapserver/5
```

Run the service:

```sh
> npm install
> npm start
```

Test by browsing to [localhost:9999/api/locations?search=general armstrongweg 1](http://localhost:9999/api/locations?search=generaal%20armstrongweg%201).
Test by browsing to [localhost:9999/api/coordinates?lat=51.196541&lng=4.421896](http://localhost:9999/api/coordinates?lng=51.196541&lat=4.421896).

The UI demo app expects the service to run on port 9999.

## Service Specification

The service implements the following first protocol:

- GET /path/to/endpoint?search=...&types=...
- search = the text that the user typed on which to match
- types = types to query for
  - Possible types are `street` (street names), `number` (address excluding bus) and `poi` (point of interest)- Comma-separated, default value is `street,number,poi`
- result = JSON-encoded array of [LocationItem](src/types.ts) objects

The service implements the following second protocol:

- GET /path/to/endpoint?lat=...&lng=...
- lat = latitude of the location
- lng = longitutde of the location
- result = JSON-encoded array of [LocationItem](src/types.ts) objects

An [example swagger description](swagger-example.json) is included.

## Contributing

We welcome your bug reports and pull requests.

Please see our [contribution guide](CONTRIBUTING.md).

## License

This project is published under the [MIT license](LICENSE.md).
