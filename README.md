# Location Picker Smart Widget BFF (Node)

This is a Node.js backend service library to create a BFF service for the Location Picker Smart Widget. The Location Picker widget provides a picker field to choose a street, street address, addressID or point of interest from GIS sources. This service is matched by a [corresponding UI](https://github.com/digipolisantwerp/location-picker_widget_angular).

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
const app = express();
const lib = require('@acpaas-ui-widgets/nodejs-location-picker');

// for the location picker widget:
const locationSearch = lib.antwerpen.locationSearchController({
    solrGisAuthorization: process.env.SOLR_GIS_AUTHORIZATION,
    solrGisUrl: process.env.SOLR_GIS_URL,
    crabUrl: process.env.CRAB_URL
});
app.get('/api/locations', locationSearch);

// coordinates api for planned leaflet extension (not currently needed):
const coordinateSearch = lib.antwerpen.coordinateSearchController({
    arcGisUrl: process.env.ARC_GIS_URL
});
app.get('/api/coordinates', coordinateSearch);

app.listen(9999);
```

The default SOLR endpoint (esb-app1-p) listed above does not require authorization, so you can leave the solrGisAuthorization property blank when using that url.

The library provides the following interface:

- antwerpen
  - *locationSearch(config)*: create an express controller that handles the connection to the data sources for locations in Antwerpen.
  - *coordinateSearch(config)*: create an express controller that handles the connection to the data sources for coordinates in Antwerpen. (Not currently needed for Location Picker widget.)

## Run the demo app

Create a .env file containing:

```sh
PORT=9999
SOLR_GIS_URL=https://esb-app1-p.antwerpen.be/v1/giszoek/solr/search
SOLR_AUTHORIZATION=
CRAB_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query
# only for coordinates service:
ARC_GIS_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Meldingen/meldingen/MapServer
#vlaanderen
VLAANDEREN_GIS_URL=http://loc.api.geopunt.be/geolocation/Location
VLAANDEREN_LOCATION_URL=http://loc.api.geopunt.be/v4
VLAANDEREN_LOCATION_URL_POI=http://loc.api.geopunt.be/v3
VLAANDEREN_LOCATION_URL_ID=https://address-o.antwerpen.be
MapServer
```
Run the service:

```sh
> npm install
> npm start
```

Test locations service by browsing to [localhost:9999/api/locations?search=general armstrongweg 1](http://localhost:9999/api/locations?search=generaal%20armstrongweg%201).
Test locations (vlaanderen) service by browsing to [localhost:9999/api/locations?search=general armstrongweg 1](http://localhost:9999/api/vlaanderen/locations?search=generaal%20armstrongweg%201).

Test coordinates service by browsing to [localhost:9999/api/coordinates?lat=51.196541&lng=4.421896](http://localhost:9999/api/coordinates?lat=51.196541&lng=4.421896).
Test coordinates service (vlaanderen) by browsing to [localhost:9999/api/coordinates?lat=51.196541&lng=4.421896](http://localhost:9999/api/vlaanderen/coordinates?lat=51.196541&lng=4.421896).

The UI demo app expects the service to run on port 9999.

## Service Specification

The service implements the following first protocol:

- GET /path/to/endpoint?search=...&types=...&id=..
- search = the text that the user typed on which to match
- id = the id of the location. This overrides search. (Optional)
- types = types to query for
  - Possible types are `street` (street names), `number` (address excluding bus) and `poi` (point of interest)- Comma-separated, default value is `street,number,poi`
- sort = how the result should be sorted
  - Possible sorting methods are `layer` (prioritizes districts, followed by streets, followed by the rest) and `name` (sorts in alphabetical order), default value is `name`
- result = JSON-encoded array of [LocationItem](src/types.ts) objects

The service implements the following second protocol:

- GET /path/to/endpoint?lat=...&lng=...
- lat = latitude of the location
- lng = longitude of the location
- result = JSON-encoded array of [LocationItem](src/types.ts) objects

An [example swagger description](swagger-example.json) is included.

## Contributing

We welcome your bug reports and pull requests.

Please see our [contribution guide](CONTRIBUTING.md).

## License

This project is published under the [MIT license](LICENSE.md).
