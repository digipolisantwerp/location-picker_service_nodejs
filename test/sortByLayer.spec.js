const sortByLayer = require('../dist/helpers/sortByLayer').default;

const unsortedList = [
                        {
                            "id": "P_DA/Locaties/MapServer/7/1",
                            "name": "Havengebied Antwerpen",
                            "layer": "havengebied",
                            "locationType": "poi",
                            "polygons": []
                        },
                        {
                            "id": "P_DA/Locaties/MapServer/18/1344915",
                            "name": "Antwerpsebaan (Berendrecht-Zandvliet-Lillo)",
                            "layer": "straatnaam",
                            "locationType": "street",
                            "coordinates": {
                                "lambert": {
                                    "x": 147522.266,
                                    "y": 225023.704
                                },
                                "latLng": {
                                    "lat": 51.334981197534698,
                                    "lng": 4.333227482668628
                                }
                            },
                            "polygons": [],
                            "street": "Antwerpsebaan",
                            "streetid": "204"
                        },
                        {
                            "id": "P_DA/Locaties/MapServer/19/7",
                            "name": "ANTWERPEN",
                            "layer": "district",
                            "locationType": "poi",
                            "polygons": []
                        },
                        {
                            "id": "P_DA/Locaties/MapServer/18/1344916",
                            "name": "Antwerpsesteenweg (Hoboken)",
                            "layer": "straatnaam",
                            "locationType": "street",
                            "coordinates": {
                                "lambert": {
                                    "x": 149513.39963577,
                                    "y": 207669.43276582
                                },
                                "latLng": {
                                    "lat": 51.179005892239718,
                                    "lng": 4.361814911998661
                                }
                            },
                            "polygons": [],
                            "street": "Antwerpsesteenweg",
                            "streetid": "205"
                        }
                    ];

const expectedResult = [
                        {
                            "id": "P_DA/Locaties/MapServer/19/7",
                            "name": "ANTWERPEN",
                            "layer": "district",
                            "locationType": "poi",
                            "polygons": []
                        },
                        {
                            "id": "P_DA/Locaties/MapServer/18/1344915",
                            "name": "Antwerpsebaan (Berendrecht-Zandvliet-Lillo)",
                            "layer": "straatnaam",
                            "locationType": "street",
                            "coordinates": {
                                "lambert": {
                                    "x": 147522.266,
                                    "y": 225023.704
                                },
                                "latLng": {
                                    "lat": 51.334981197534698,
                                    "lng": 4.333227482668628
                                }
                            },
                            "polygons": [],
                            "street": "Antwerpsebaan",
                            "streetid": "204"
                        },
                        {
                            "id": "P_DA/Locaties/MapServer/18/1344916",
                            "name": "Antwerpsesteenweg (Hoboken)",
                            "layer": "straatnaam",
                            "locationType": "street",
                            "coordinates": {
                                "lambert": {
                                    "x": 149513.39963577,
                                    "y": 207669.43276582
                                },
                                "latLng": {
                                    "lat": 51.179005892239718,
                                    "lng": 4.361814911998661
                                }
                            },
                            "polygons": [],
                            "street": "Antwerpsesteenweg",
                            "streetid": "205"
                        },
                        {
                            "id": "P_DA/Locaties/MapServer/7/1",
                            "name": "Havengebied Antwerpen",
                            "layer": "havengebied",
                            "locationType": "poi",
                            "polygons": []
                        }
                    ];

describe("sortByLayer", () => {
    it("should sort the list putting districts first, then streets, then the rest", () => {
        var sortedList = sortByLayer(unsortedList);
        expect(sortedList[0].id).toBe(expectedResult[0].id);
        expect(sortedList[1].id).toBe(expectedResult[1].id);
        expect(sortedList[2].id).toBe(expectedResult[2].id);
        expect(sortedList[3].id).toBe(expectedResult[3].id);
    });
});