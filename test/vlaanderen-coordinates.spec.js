const proxyquire = require('proxyquire');
const sinon = require('sinon');
const axios = require('axios');
const coordinateService = require('../dist/vlaanderen/services/coordinate.service');

describe('Vlaanderen', () => {
    describe('Cooordinates service', () => {
        const config = {
            gisUrl: 'fakegisUrl',
        }
        const configNoPoi = {
            locationUrl: 'fakelocationUrl',
            locationIdUrl: 'fakelocationIdUrl',
        }
        const response = {

        }
        describe('Get Location by id', () => {
            const serverResponse = {
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
                };
            beforeEach(() => {
                axiosspy = sinon.stub(axios, 'get').resolves(serverResponse);
            });
            afterEach(() => {
                axios.get.restore()

            });
            it('Should return an array', (done) => {
                const locationid = 123;
                coordinateService.getByCoordinates({ lat: 51.2109664 , lng:4.4146927 }, config).then((result) => {
                    const serverResponseData = serverResponse.data.LocationResult[0]
                    expect(result.id).toBe(serverResponseData.ID);
                    expect(result.name).toBe(serverResponseData.FormattedAddress);
                    expect(result.street).toBe(serverResponseData.Thoroughfarename);
                    expect(result.number).toBe(serverResponseData.Housenumber);
                    expect(result.postal).toBe(serverResponseData.Zipcode);
                    expect(result.district).toBe(serverResponseData.Municipality);
                    expect(result.locationType).toBe("street");
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        })
    });
    describe('Coordinates controller', () => {
        const config = {
            gisUrl: 'fakegisUrl',
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
                const createController = proxyquire('../dist/vlaanderen/controller/coordinate.controller', {
                    '../services/coordinate.service':{
                     getByCoordinates: (search) => {
                        expect(search).toEqual({ lat : 51.2109664, lng : 4.4146927  });
                        return Promise.resolve(testResult);
                     }
                    }
                });
                const controller = createController.default({ gisUrl: "fakegis" });
                controller({
                    query: { lat: 51.2109664 , lng:4.4146927 }
                }, {
                    json: (result) => {
                        expect(result).toEqual({ location: testResult});
                        done();
                    }
                }, () => {});
            });
        });
    });
});
