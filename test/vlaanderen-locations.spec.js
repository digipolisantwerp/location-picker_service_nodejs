const proxyquire = require('proxyquire');
const sinon = require('sinon');
const axios = require('axios');
const locationService = require('../dist/vlaanderen/services/location.service');

describe('Vlaanderen', () => {
    describe('location', () => {
        const config = {
            locationUrl: 'fakelocationUrl',
            locationPoiUrl: 'fakelocatinPoiUrl',
            locationIdUrl: 'fakelocationIdUrl',
        }
        const configNoPoi = {
            locationUrl: 'fakelocationUrl',
            locationIdUrl: 'fakelocationIdUrl',
        }
        const response = {

        }
        describe('Get Location by id', () => {
            beforeEach(() => {
                axiosspy = sinon.stub(axios, 'get').resolves({
                    data: {
                        '_embedded': {
                            'addressdetail': [
                                {
                                    'addressid': 2460042,
                                    'municipalityPost': {
                                        'municipality': 'Antwerpen',
                                        'niScode': 11002,
                                        'antwerpDistrict': 'Antwerpen',
                                        'postcode': 2000
                                    },
                                    'street': {
                                        'streetNameId': 1471,
                                        'streetName': 'Kasteelpleinstraat'
                                    },
                                    'houseNumbers': {
                                        'houseNumber': '20'
                                    },
                                    'formattedAddress': 'Kasteelpleinstraat 20, 2000 Antwerpen',
                                    'addressPosition': {
                                        'xlambert72': 152276.59,
                                        'ylambert72': 211182.68,
                                        'latwgs84': 51.210598,
                                        'lonwgs84': 4.401336,
                                        'geometryMethod': 'AfgeleidVanObject',
                                        'geometrySpecification': 'Gebouweenheid'
                                    },
                                    'addressStatus': 'InGebruik',
                                    'officiallyAccepted': true
                                }
                            ]
                        },
                        '_links': {},
                        '_page': {
                            'number': 0,
                            'size': 0,
                            'totalElements': 0,
                            'totalPages': 0
                        }
                    }
                });
            });
            afterEach(() => {
                axios.get.restore()

            });
            it('Should return an array', (done) => {
                const locationid = 123;
                locationService.queryLocation({ id: locationid }, config).then((result) => {
                    expect(Array.isArray(result)).toBe(true);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        })
        describe('Get location by searchterm', () => {
            beforeEach(() => {
                axiosspy = sinon.stub(axios, 'get').resolves({
                    data: {
                        "LocationResult": [
                            {
                                "Municipality": "Antwerpen",
                                "Zipcode": "2018",
                                "Thoroughfarename": "Korte Lozanastraat",
                                "Housenumber": null,
                                "ID": 1628,
                                "FormattedAddress": "Korte Lozanastraat, Antwerpen",
                                "Location": {
                                    "Lat_WGS84": 51.196736398586616,
                                    "Lon_WGS84": 4.408126870334539,
                                    "X_Lambert72": 152751.98,
                                    "Y_Lambert72": 209640.76
                                },
                                "LocationType": "crab_straat",
                                "BoundingBox": {
                                    "LowerLeft": {
                                        "Lat_WGS84": 51.19572570649284,
                                        "Lon_WGS84": 4.4076770938913,
                                        "X_Lambert72": 152720.6,
                                        "Y_Lambert72": 209528.3
                                    },
                                    "UpperRight": {
                                        "Lat_WGS84": 51.19751621794456,
                                        "Lon_WGS84": 4.408712802955401,
                                        "X_Lambert72": 152792.89,
                                        "Y_Lambert72": 209727.54
                                    }
                                }
                            }
                        ]
                    }
                });
            });
            afterEach(() => {
                axios.get.restore()
            });
            it('Should return an array', (done) => {
                const searchterm = 'hello';
                locationService.queryLocation({ search: searchterm, types: "street,number,poi" }, config).then((result) => {
                    expect(Array.isArray(result)).toBe(true);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        })
        describe('createService searchterm (no result)', () => {
            beforeEach(() => {
                axiosspy = sinon.stub(axios, 'get').resolves({
                    data: {
                        "LocationResult": [
                        ]
                    }
                });
            });
            afterEach(() => {
                axios.get.restore()
            });
            it('Should return an array', (done) => {
                const searchterm = 'hello';
                locationService.queryLocation({ search: searchterm, types: "street,number,poi" }, config).then((result) => {
                    expect(Array.isArray(result)).toBe(true);
                    done();
                }).catch((err) => {
                    console.log(err);
                    done(err);
                });
            });
        })
        describe('createService searchterm (no poi configuration)', () => {
            beforeEach(() => {
                axiosspy = sinon.stub(axios, 'get').resolves({
                    data: {
                        "LocationResult": [
                        ]
                    }
                });
            });
            afterEach(() => {
                axios.get.restore()
            });
            it('Should return an array', (done) => {
                const searchterm = 'hello';
                locationService.queryLocation({ search: searchterm, types: "street,number,poi" }, configNoPoi).then((result) => {
                    expect(Array.isArray(result)).toBe(true);
                    done();
                }).catch((err) => {
                    console.log(err);
                    done(err);
                });
            });
        })
    })
    describe('location controller', () => {
        const config = {
            locationUrl: 'fakelocationUrl',
            locationPoiUrl: 'fakelocatinPoiUrl',
            locationIdUrl: 'fakelocationIdUrl',
        }
        const configNoPoi = {
            locationUrl: 'fakelocationUrl',
            locationIdUrl: 'fakelocationIdUrl',
        }
        const response = {

        }
        describe('createController', () => {
            it('should call the service and output json', (done) => {
                const testResult = {};
                const createController = proxyquire('../dist/vlaanderen/controller/location.controller', {
                    '../services/location.service':{
                     queryLocation: (search) => {
                        expect(search).toEqual("hello");
                        return Promise.resolve(testResult);
                     }
                    }
                });
                const controller = createController.default({ gisUrl: "fakegis" });
                controller({
                    query: "hello"
                }, {
                    json: (result) => {
                        expect(result).toEqual(testResult);
                        done();
                    }
                }, () => {});
            });
        });
    });
});
