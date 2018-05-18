# Location Picker Smart Widget BFF (Node)

This is a Node.js backend service library to create a BFF service for the Location Picker Smart Widget. The widget provides a picker field to choose a street, street address or point of interest from GIS sources. This service is matched by a [corresponding UI](https://github.com/digipolisantwerp/location-picker_widget_angular).

There is a **demo service**, see below for instructions on running it.

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
const controller = pickerHelper.antwerpen.createController({
    solrGisAuthorization: '<auth key>',
    solrGisUrl: 'https://esb-app1-p.antwerpen.be/v1/giszoek/solr/search',
    crabUrl: 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query'
});
app.get('/api/locations', controller);
app.listen(9999);
```

You can obtain credentials for the SOLR API by asking on the [#acpaas-ui slack channel](https://dgpls.slack.com/messages/C4M60PQJF).

The library provides the following interface:

- antwerpen
  - *createController(config)*: create an express controller that handles the connection to the data sources for locations in Antwerpen
  - *createService(config)*: create a function that accepts a query and returns a promise of the results of locations in Antwerpen for that query. The createController routine builds on top of this.

## Run the demo app

Create a .env file containing:

```sh
PORT=9999
SOLR_GIS_URL=https://esb-app1-p.antwerpen.be/v1/giszoek/solr/search
SOLR_AUTHORIZATION=<auth key here>
CRAB_URL=https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query
```

Run the service:

```sh
> npm install
> npm start
```

Test by browsing to [localhost:9999/api/locations?search=general armstrongweg 1](http://localhost:9999/api/locations?search=generaal%20armstrongweg%201).

The UI demo app expects the service to run on port 9999.

## Service Specification

The service implements the following protocol:

- GET /path/to/endpoint?search=...&types=...
- search = the text that the user typed on which to match
- types = types to query for
  - Possible types are `street` (street names), `number` (address excluding bus) and `poi` (point of interest)- Comma-separated, default value is `street,number,poi`
- result = JSON-encoded array of [LocationItem](src/types.ts) objects

An [example swagger description](swagger-example.json) is included.

## Contributing

We welcome your bug reports and pull requests.

Please see our [contribution guide](CONTRIBUTING.md).

## License

This project is published under the [MIT license](LICENSE.md).
