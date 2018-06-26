const proxyquire = require('proxyquire');
const sinon = require("sinon");

const {CoordinateService} = require('../dist/antwerpen/coordinate/coordinate.service');

describe('antwerpen', () => {
    describe('location', () => {
        const dummyCrabResult = {
            "features": [
                {
                    "attributes": {
                        "HUISNR": "1",
                        "STRAATNMID": 962,
                        "STRAATNM": "Generaal Armstrongweg",
                        "HNRLABEL": "1",
                        "OBJECTID": 237478,
                        "ID": 2001887628,
                        "APPTNR": " ",
                        "BUSNR": " ",
                        "NISCODE": "11002",
                        "GEMEENTE": "Antwerpen",
                        "POSTCODE": "2020",
                        "HERKOMST": "afgeleidVanGebouw"
                    },
                    "geometry": {
                        "x": 150910.28999999911,
                        "y": 209456.6099999994
                    }
                }
            ]
        }

        const dummySolrResult = {
            "response": {
                "numFound": 1,
                "start": 0,
                "docs": [
                    {
                        "id": "A_DA/Locaties/MapServer/18/86232",
                        "key": "86232",
                        "name": "Generaal Armstrongweg",
                        "layer": "straatnaam",
                        "layerString": "straatnaam",
                        "exactName": "straatnaam",
                        "x": 150586.13763413,
                        "y": 209790.41625429,
                        "_version_": 1600679612209168387,
                        "last_indexed": "2018-05-17T03:17:14.617Z"
                    }
                ]
            }
        }

        const crabTestUrl = 'http://example.com/crab/query';
        const solrTestUrl = 'http://example.com/solr/search';
        const solrTestAuth = 'test';

        describe('createService', () => {
            it('should query CRAB if detecting a number', () => {
                const query = 'generaal armstrongweg 1';
                const createService = proxyquire('../dist/antwerpen/location/location.service', {
                    'request': (options, handler) => {
                        expect(options.url).toEqual(crabTestUrl + "?f=json&orderByFields=HUISNR&where=GEMEENTE='Antwerpen' and " + "STRAATNM='generaal%20armstrongweg' and HUISNR='1' and APPTNR='' and BUSNR=''&outFields=*");
                        return handler(null, {
                            statusCode: 200
                        }, dummyCrabResult);
                    }
                });
                const fn = createService({solrGisAuthorization: solrTestAuth, solrGisUrl: solrTestUrl, crabUrl: crabTestUrl});
                fn(query).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.length).toEqual(1);
                    expect(result[0].id).toEqual("2001887628");
                });
            });

            it('should query SOLR for a streetname or poi', () => {
                const query = 'generaal armstrongweg';
                const createService = proxyquire('../dist/antwerpen/location/location.service', {
                    'request': (options, handler) => {
                        expect(options.url).toEqual(solrTestUrl + "?wt=json&rows=5&solrtype=gislocaties&dismax=true&bq=exactName:DISTRICT^20000.0&bq=layer:straatnaam^20000.0&q=(generaal%20armstrongweg)");
                        return handler(null, {
                            statusCode: 200
                        }, dummySolrResult);
                    }
                });
                const fn = createService({solrGisAuthorization: solrTestAuth, solrGisUrl: solrTestUrl, crabUrl: crabTestUrl});
                fn(query).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.length).toEqual(1);
                    expect(result[0].id).toEqual("86232");
                });
            });
        });

        describe('createController', () => {
            it('should call the service and output json', (done) => {
                const testResult = {};
                const createController = proxyquire('../dist/antwerpen/location/location.controller', {
                    './location.service': () => (search) => {
                        expect(search).toEqual('test');
                        return Promise.resolve(testResult);
                    }
                });
                const controller = createController({});
                controller({
                    query: {
                        search: 'test'
                    }
                }, {
                    json: (result) => {
                        expect(result).toEqual(testResult);
                        done();
                    }
                }, () => {});
            });
        });
    });

    describe('coordinate', () => {
        const dummyWithinResult = {
            "results": [
                {
                    "layerId": 21,
                    "layerName": "park",
                    "displayFieldName": "NAAM",
                    "value": "STADSPARK",
                    "attributes": {
                        "OBJECTID": "2405",
                        "STRAAT": "QUINTEN MATSIJSLEI",
                        "DISTRICT": "ANTWERPEN",
                        "POSTCODE": "2018",
                        "TYPE": "park",
                        "CLUSTER": "Cluster Noord",
                        "NAAM": "STADSPARK",
                        "SHAPE": "Polygon",
                        "GISID": "GT002948",
                        "SHAPE.area": "115234,391022",
                        "SHAPE.len": "1510,363849",
                        "BEHEER": "SB",
                        "EIGENDOM": "Null",
                        "AFDELING_SB_GB": "Antwerpen Centrum"
                    },
                    "geometryType": "esriGeometryPolygon",
                    "geometry": {
                        "rings": [
                            [
                                [
                                    4.4157293107486284, 51.213926197454541
                                ],
                                [
                                    4.4157386507523917, 51.21387634664805
                                ],
                                [
                                    4.4157479937805384, 51.213830872296917
                                ]
                            ]
                        ],
                        "spatialReference": {
                            "wkid": 4326,
                            "latestWkid": 4326
                        }
                    }
                }
            ]
        }

        const dummyReverseGeocode = [
            {
                "straatnmid": 599,
                "straatnm": "De Braekeleerstraat",
                "huisnr": "21",
                "postcode": "2018",
                "district": "Antwerpen",
                "herkomst": "afgeleidVanGebouw",
                "districtcode": "AN",
                "xy": {
                    "x": 51.2002337110138,
                    "y": 4.39354940380986
                },
                "distance": 14.306
            }, {
                "straatnmid": 599,
                "straatnm": "De Braekeleerstraat",
                "huisnr": "22",
                "postcode": "2018",
                "district": "Antwerpen",
                "herkomst": "afgeleidVanGebouw",
                "districtcode": "AN",
                "xy": {
                    "x": 51.200482258162424,
                    "y": 4.3934738555119957
                },
                "distance": 14.381
            }
        ];

        const queryTestUrl = 'http://example.com/location/within';

        describe('createService', () => {
            var coordinateService;
            const config = {
                queryUrl: queryTestUrl
            };
            const service = new CoordinateService(config);

            beforeEach(() => {
                coordinateService = sinon.mock(service);
            })

            afterEach(() => {
                coordinateService.restore();
            })

            it('should return a park location with the correct properties', (done) => {
                coordinateService.expects("getPointWithin").resolves(dummyWithinResult);

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(dummyWithinResult.results[0].attributes.OBJECTID);
                    expect(result.street).toEqual(dummyWithinResult.results[0].attributes.STRAAT);
                    expect(result.postal).toEqual(dummyWithinResult.results[0].attributes.POSTCODE);
                    expect(result.locationType).toEqual("PARK");
                    expect(result.polygons).not.toBeNull();
                    expect(result.polygons.length).toEqual(dummyWithinResult.results[0].geometry.rings.length);
                    expect(result.polygons[0].length).toEqual(dummyWithinResult.results[0].geometry.rings[0].length);

                    done();
                })
            });

            it('should return a street location when no park was found + correct properties', (done) => {
                coordinateService.expects("getPointWithin").resolves([]);
                coordinateService.expects("reverseGeocode").resolves(dummyReverseGeocode);

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(dummyReverseGeocode[0].straatnmid.toString());
                    expect(result.street).toEqual(dummyReverseGeocode[0].straatnm);
                    expect(result.postal).toEqual(dummyReverseGeocode[0].postcode);
                    expect(result.locationType).toEqual("STREET");

                    done();
                })
            });

            it('should return nothing if no park or street is found', (done) => {
                coordinateService.expects("getPointWithin").resolves([]);
                coordinateService.expects("reverseGeocode").resolves([]);

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    expect(result).toBeNull();
                    done();
                })
            });
        });
    });
});
