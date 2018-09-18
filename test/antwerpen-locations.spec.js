const proxyquire = require('proxyquire');

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
                        expect(options.url).toEqual(crabTestUrl + "?f=json&orderByFields=HUISNR&where=GEMEENTE='Antwerpen' and " + "STRAATNM LIKE 'generaal%20armstrongweg%' and HUISNR='1' and APPTNR='' and BUSNR=''&outFields=*");
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
                    expect(result[0].id).toEqual("A_DA/Locaties/MapServer/18/86232");
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
    })
});
