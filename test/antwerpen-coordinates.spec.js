const sinon = require("sinon");

const { CoordinateService } = require("../dist/antwerpen/coordinate/coordinate.service");

describe("antwerpen", () => {
    describe("coordinate", () => {
        const dummyParkResult = {
            results: [
                {
                    layerId: 21,
                    layerName: "park",
                    displayFieldName: "NAAM",
                    value: "STADSPARK",
                    attributes: {
                        OBJECTID: "2405",
                        STRAAT: "QUINTEN MATSIJSLEI",
                        DISTRICT: "ANTWERPEN",
                        POSTCODE: "2018",
                        TYPE: "park",
                        CLUSTER: "Cluster Noord",
                        NAAM: "STADSPARK",
                        SHAPE: "Polygon",
                        GISID: "GT002948",
                        "SHAPE.area": "115234,391022",
                        "SHAPE.len": "1510,363849",
                        BEHEER: "SB",
                        EIGENDOM: "Null",
                        AFDELING_SB_GB: "Antwerpen Centrum",
                    },
                    geometryType: "esriGeometryPolygon",
                    geometry: {
                        rings: [
                            [
                                [4.4157293107486284, 51.213926197454541],
                                [4.4157386507523917, 51.21387634664805],
                                [4.4157479937805384, 51.213830872296917],
                            ],
                        ],
                        spatialReference: {
                            wkid: 4326,
                            latestWkid: 4326,
                        },
                    },
                },
            ],
        };

        const dummyGlassContainerResult = {
            "displayFieldName": "straatnaam",
            "fieldAliases": {
                "glascontainer_nr": "glascontainer_nr",
                "straatnaam": "straatnaam",
                "huisnummer": "huisnummer",
                "postcode": "postcode",
                "type": "type",
                "ondergrond_verhard": "ondergrond_verhard",
                "opmerking": "opmerking",
                "begindatum": "begindatum",
                "ObjectID": "ObjectID",
                "GISID": "GISID",
                "ledfreq": "ledfreq",
                "ma": "ma",
                "di": "di",
                "wo": "wo",
                "do": "do",
                "vr": "vr"
            },
            "geometryType": "esriGeometryPoint",
            "spatialReference": {
                "wkid": 4326,
                "latestWkid": 4326
            },
            "fields": [
                {
                    "name": "glascontainer_nr",
                    "type": "esriFieldTypeString",
                    "alias": "glascontainer_nr",
                    "length": 10
                },
                {
                    "name": "straatnaam",
                    "type": "esriFieldTypeString",
                    "alias": "straatnaam",
                    "length": 80
                },
                {
                    "name": "huisnummer",
                    "type": "esriFieldTypeString",
                    "alias": "huisnummer",
                    "length": 15
                },
                {
                    "name": "postcode",
                    "type": "esriFieldTypeString",
                    "alias": "postcode",
                    "length": 4
                },
                {
                    "name": "type",
                    "type": "esriFieldTypeString",
                    "alias": "type",
                    "length": 50
                },
                {
                    "name": "ondergrond_verhard",
                    "type": "esriFieldTypeString",
                    "alias": "ondergrond_verhard",
                    "length": 4
                },
                {
                    "name": "opmerking",
                    "type": "esriFieldTypeString",
                    "alias": "opmerking",
                    "length": 100
                },
                {
                    "name": "begindatum",
                    "type": "esriFieldTypeDate",
                    "alias": "begindatum",
                    "length": 8
                },
                {
                    "name": "ObjectID",
                    "type": "esriFieldTypeOID",
                    "alias": "ObjectID"
                },
                {
                    "name": "GISID",
                    "type": "esriFieldTypeString",
                    "alias": "GISID",
                    "length": 20
                },
                {
                    "name": "ledfreq",
                    "type": "esriFieldTypeString",
                    "alias": "ledfreq",
                    "length": 20
                },
                {
                    "name": "ma",
                    "type": "esriFieldTypeString",
                    "alias": "ma",
                    "length": 1
                },
                {
                    "name": "di",
                    "type": "esriFieldTypeString",
                    "alias": "di",
                    "length": 1
                },
                {
                    "name": "wo",
                    "type": "esriFieldTypeString",
                    "alias": "wo",
                    "length": 1
                },
                {
                    "name": "do",
                    "type": "esriFieldTypeString",
                    "alias": "do",
                    "length": 1
                },
                {
                    "name": "vr",
                    "type": "esriFieldTypeString",
                    "alias": "vr",
                    "length": 1
                }
            ],
            "features": [
                {
                    "attributes": {
                        "glascontainer_nr": "1525",
                        "straatnaam": "STEENPLEIN",
                        "huisnummer": null,
                        "postcode": "2000",
                        "type": "mono glasbol wit",
                        "ondergrond_verhard": "ja",
                        "opmerking": "geen",
                        "begindatum": null,
                        "ObjectID": 432,
                        "GISID": "GLASCONT_01915",
                        "ledfreq": null,
                        "ma": null,
                        "di": null,
                        "wo": null,
                        "do": null,
                        "vr": null
                    },
                    "geometry": {
                        "x": 4.3967833216867671,
                        "y": 51.221130971102895
                    }
                }
            ]
        };
        
        const dummyBicycleRouteResult = {
            features: [
                {
                    layerId: 6,
                    layerName: "fietspad",
                    displayFieldName: "STRAAT",
                    value: "ITALIELEI",
                    attributes: {
                        STRAAT: "ITALIELEI",
                        objectsleutel: "FTP 002554",
                        straatcode: "20007216",
                        postcode_links: "2000",
                        postcode_rechts: "2000",
                        DISTRICT: "ANTWERPEN",
                        object_sleutel_straatas: "WGSO2000002554",
                        wegnummer: "N1",
                        wegklasse: "hoofdweg",
                        beginknoop: "WGKO2000005719",
                        eindknoop: "WGKO2000005832",
                        wegbevoegdheid: "gewest Nweg",
                        van_zijstr: "ITALI‰LEI 4",
                        tot_zijstr: "KORTE WINKELSTRAAT",
                        l_aardbeschrijving: "enkel",
                        l_type_nub: "vrijliggend",
                        l_materiaal: "beton",
                        l_breedte: "140",
                        l_tussenst: "niet overrijdbaar",
                        l_tussen: "160",
                        r_aardbeschrijving: "enkel",
                        r_type_nub: "vrijliggend",
                        r_materiaal: "beton",
                        r_breedte: "140",
                        r_tussenst: "niet overrijdbaar",
                        r_tussen: "640",
                        label: "enkel beide zijden",
                        shape: "Polyline",
                        ObjectID: "407",
                        "shape.len": "2246,250689",
                    },
                    geometryType: "esriGeometryPolyline",
                    geometry: {
                        paths: [
                            [[4.4167853940453936, 51.220671585044826], [4.4168755739820709, 51.220896724956141]],
                            [[4.4161915368535301, 51.22068351319092], [4.4162467185925696, 51.22082616340645]],
                            [[4.4143851559795557, 51.226162220313206], [4.4143151943969228, 51.226330644794658]],
                        ],
                        spatialReference: {
                            wkid: 4326,
                            latestWkid: 4326,
                        },
                    },
                },
            ],
        };

        const dummyStreetResult = {
            displayFieldName: "HUISNR",
            fieldAliases: {
                HUISNR: "huisnr",
                STRAATNMID: "straatnmid",
                STRAATNM: "straatnm",
                HNRLABEL: "hnrlabel",
                OBJECTID: "ObjectID",
                ID: "ID",
                APPTNR: "APPTNR",
                BUSNR: "BUSNR",
                NISCODE: "NISCODE",
                GEMEENTE: "GEMEENTE",
                POSTCODE: "POSTCODE",
                HERKOMST: "HERKOMST",
            },
            geometryType: "esriGeometryPoint",
            spatialReference: {
                wkid: 4326,
                latestWkid: 4326,
            },
            fields: [],
            features: [
                {
                    attributes: {
                        HUISNR: "6",
                        STRAATNMID: 2124,
                        STRAATNM: "Noorderplaats",
                        HNRLABEL: "6",
                        OBJECTID: 42975,
                        ID: 2004281641,
                        APPTNR: " ",
                        BUSNR: " ",
                        NISCODE: "11002",
                        GEMEENTE: "Antwerpen",
                        POSTCODE: "2000",
                        HERKOMST: "manueleAanduidingVanIngangVanGebouw",
                    },
                    geometry: {
                        x: 4.4136837928344992,
                        y: 51.230604244600464,
                    },
                },
            ],
        };

        const dummyReverseGeocode = [
            {
                straatnmid: 599,
                straatnm: "De Braekeleerstraat",
                huisnr: "21",
                postcode: "2018",
                district: "Antwerpen",
                herkomst: "afgeleidVanGebouw",
                districtcode: "AN",
                xy: {
                    x: 51.2002337110138,
                    y: 4.39354940380986,
                },
                distance: 14.306,
            },
            {
                straatnmid: 599,
                straatnm: "De Braekeleerstraat",
                huisnr: "22",
                postcode: "2018",
                district: "Antwerpen",
                herkomst: "afgeleidVanGebouw",
                districtcode: "AN",
                xy: {
                    x: 51.200482258162424,
                    y: 4.3934738555119957,
                },
                distance: 14.381,
            },
        ];

        const dummyRegionalRoad = {
            "displayFieldName": "LSTRNM",
            "fieldAliases": {
                "OBJECTID": "OBJECTID",
                "BEHEER": "BEHEER",
                "WS_OIDN": "WS_OIDN",
                "WS_UIDN": "WS_UIDN",
                "WS_GIDN": "WS_GIDN",
                "B_WK_OIDN": "B_WK_OIDN",
                "E_WK_OIDN": "E_WK_OIDN",
                "MORF": "MORF",
                "WEGCAT": "WEGCAT",
                "LSTRNMID": "LSTRNMID",
                "LSTRNM": "LSTRNM",
                "RSTRNMID": "RSTRNMID",
                "RSTRNM": "RSTRNM",
                "METHODE": "METHODE",
                "OPNDATUM": "OPNDATUM",
                "BEGINTIJD": "BEGINTIJD",
                "BEGINORG": "BEGINORG",
                "TGBEP": "TGBEP",
                "GBKA_ID": "GBKA_ID",
                "WEGNUMMER": "WEGNUMMER",
                "SHAPE.len": "SHAPE.len"
            },
            "geometryType": "esriGeometryPolyline",
            "spatialReference": {
                "wkid": 4326,
                "latestWkid": 4326
            },
            "fields": [
                {
                    "name": "OBJECTID",
                    "type": "esriFieldTypeOID",
                    "alias": "OBJECTID"
                },
                {
                    "name": "BEHEER",
                    "type": "esriFieldTypeString",
                    "alias": "BEHEER",
                    "length": 60
                },
                {
                    "name": "WS_OIDN",
                    "type": "esriFieldTypeDouble",
                    "alias": "WS_OIDN"
                },
                {
                    "name": "WS_UIDN",
                    "type": "esriFieldTypeString",
                    "alias": "WS_UIDN",
                    "length": 30
                },
                {
                    "name": "WS_GIDN",
                    "type": "esriFieldTypeString",
                    "alias": "WS_GIDN",
                    "length": 30
                },
                {
                    "name": "B_WK_OIDN",
                    "type": "esriFieldTypeDouble",
                    "alias": "B_WK_OIDN"
                },
                {
                    "name": "E_WK_OIDN",
                    "type": "esriFieldTypeDouble",
                    "alias": "E_WK_OIDN"
                },
                {
                    "name": "MORF",
                    "type": "esriFieldTypeString",
                    "alias": "MORF",
                    "length": 64
                },
                {
                    "name": "WEGCAT",
                    "type": "esriFieldTypeString",
                    "alias": "WEGCAT",
                    "length": 64
                },
                {
                    "name": "LSTRNMID",
                    "type": "esriFieldTypeDouble",
                    "alias": "LSTRNMID"
                },
                {
                    "name": "LSTRNM",
                    "type": "esriFieldTypeString",
                    "alias": "LSTRNM",
                    "length": 255
                },
                {
                    "name": "RSTRNMID",
                    "type": "esriFieldTypeDouble",
                    "alias": "RSTRNMID"
                },
                {
                    "name": "RSTRNM",
                    "type": "esriFieldTypeString",
                    "alias": "RSTRNM",
                    "length": 255
                },
                {
                    "name": "METHODE",
                    "type": "esriFieldTypeString",
                    "alias": "METHODE",
                    "length": 64
                },
                {
                    "name": "OPNDATUM",
                    "type": "esriFieldTypeDate",
                    "alias": "OPNDATUM",
                    "length": 8
                },
                {
                    "name": "BEGINTIJD",
                    "type": "esriFieldTypeDate",
                    "alias": "BEGINTIJD",
                    "length": 8
                },
                {
                    "name": "BEGINORG",
                    "type": "esriFieldTypeString",
                    "alias": "BEGINORG",
                    "length": 60
                },
                {
                    "name": "TGBEP",
                    "type": "esriFieldTypeString",
                    "alias": "TGBEP",
                    "length": 64
                },
                {
                    "name": "GBKA_ID",
                    "type": "esriFieldTypeString",
                    "alias": "GBKA_ID",
                    "length": 16
                },
                {
                    "name": "WEGNUMMER",
                    "type": "esriFieldTypeString",
                    "alias": "WEGNUMMER",
                    "length": 16
                },
                {
                    "name": "SHAPE.len",
                    "type": "esriFieldTypeDouble",
                    "alias": "SHAPE.len"
                }
            ],
            "features": [
                {
                    "attributes": {
                        "OBJECTID": 4278,
                        "BEHEER": "Agentschap Wegen en Verkeer – District Antwerpen",
                        "WS_OIDN": 443038,
                        "WS_UIDN": "443038_3",
                        "WS_GIDN": "443038_3",
                        "B_WK_OIDN": 2017736,
                        "E_WK_OIDN": 886076,
                        "MORF": "weg bestaande uit één rijbaan",
                        "WEGCAT": "lokale weg type 1",
                        "LSTRNMID": 3131,
                        "LSTRNM": "Waaslandtunnel",
                        "RSTRNMID": 3131,
                        "RSTRNM": "Waaslandtunnel",
                        "METHODE": "ingemeten",
                        "OPNDATUM": 1489451702000,
                        "BEGINTIJD": 1489452031000,
                        "BEGINORG": null,
                        "TGBEP": "openbare weg",
                        "GBKA_ID": "WGSO2000011790",
                        "WEGNUMMER": "N49A",
                        "SHAPE.len": 1770.1202351358688
                    },
                    "geometry": {
                        "paths": [
                            [
                                [
                                    4.3848554323514879,
                                    51.227278487792972
                                ],
                                [
                                    4.3895442044054285,
                                    51.227195400823213
                                ],
                                [
                                    4.3917237671597773,
                                    51.227167156757098
                                ],
                                [
                                    4.3918285394528542,
                                    51.227165805465631
                                ],
                                [
                                    4.3924810363382152,
                                    51.2271573402953
                                ],
                                [
                                    4.3936977052640982,
                                    51.22714154188219
                                ],
                                [
                                    4.3994721187998778,
                                    51.227066408385575
                                ],
                                [
                                    4.4003689835059498,
                                    51.227052576330244
                                ],
                                [
                                    4.4009694410881295,
                                    51.227043314518596
                                ],
                                [
                                    4.401107323266479,
                                    51.227041181775775
                                ],
                                [
                                    4.4012152870674557,
                                    51.22703951567123
                                ],
                                [
                                    4.4012913140789527,
                                    51.227038343819224
                                ],
                                [
                                    4.4014682332562938,
                                    51.227035615434922
                                ],
                                [
                                    4.4015360148122902,
                                    51.227034571591972
                                ],
                                [
                                    4.4015997308983197,
                                    51.227033582793574
                                ],
                                [
                                    4.4016932508290285,
                                    51.22703214505767
                                ],
                                [
                                    4.4033552611202484,
                                    51.226982620136724
                                ],
                                [
                                    4.4033611874544274,
                                    51.226982438600345
                                ],
                                [
                                    4.4034182460357885,
                                    51.226980327263632
                                ],
                                [
                                    4.4034222684755093,
                                    51.226980173258561
                                ],
                                [
                                    4.4050525869508652,
                                    51.22691961421696
                                ],
                                [
                                    4.4051506856344993,
                                    51.226915970164491
                                ],
                                [
                                    4.4052012451731812,
                                    51.226914093703229
                                ],
                                [
                                    4.4053731208704754,
                                    51.226906543296323
                                ],
                                [
                                    4.4055590248377472,
                                    51.226898376982945
                                ],
                                [
                                    4.4070406817265333,
                                    51.226965301600067
                                ],
                                [
                                    4.4070747673682051,
                                    51.226966836357889
                                ],
                                [
                                    4.4071648709098259,
                                    51.226971633347901
                                ],
                                [
                                    4.4093086792660117,
                                    51.22708573134193
                                ],
                                [
                                    4.409558075845772,
                                    51.227099000794972
                                ],
                                [
                                    4.4097718151714878,
                                    51.227114214803777
                                ],
                                [
                                    4.410167669930793,
                                    51.227142387859203
                                ]
                            ]
                        ]
                    }
                }
            ]
        }

        const queryTestUrl = "http://example.com/location/within";

        describe("createService", () => {
            var coordinateService;
            const config = {
                queryUrl: queryTestUrl,
            };
            // @ts-ignore
            const service = new CoordinateService(config);

            beforeEach(() => {
                coordinateService = sinon.mock(service);
            });

            afterEach(() => {
                coordinateService.restore();
            });

            it("should return a park location with the correct properties", (done) => {
                coordinateService.expects("getPointWithin").resolves(dummyParkResult);

                const lng = "123";
                const lat = "321";


                service.getLocation(lng, lat).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(dummyParkResult.results[0].attributes.OBJECTID);
                    expect(result.street).toEqual(dummyParkResult.results[0].attributes.STRAAT);
                    expect(result.postal).toEqual(dummyParkResult.results[0].attributes.POSTCODE);
                    expect(result.locationType).toEqual("park");
                    expect(result.polygons).not.toBeNull();
                    expect(result.polygons.length).toEqual(dummyParkResult.results[0].geometry.rings.length);
                    expect(result.polygons[0].length).toEqual(dummyParkResult.results[0].geometry.rings[0].length);
                    
                    done();
                })
            });

            it("should return a glass container when no park is found", (done) => {
                var stub = sinon.stub(service, "getPointWithin");
                stub.onFirstCall().resolves();

                coordinateService.expects("getPointNearby").resolves(dummyGlassContainerResult);

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    const glassContainer = dummyGlassContainerResult.features[0];

                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(glassContainer.attributes.ObjectID.toString());
                    expect(result.street).toEqual(glassContainer.attributes.straatnaam);
                    expect(result.name).toEqual(glassContainer.attributes.glascontainer_nr);
                    expect(result.postal).toEqual(glassContainer.attributes.postcode);
                    expect(result.locationType).toEqual("glasscontainer");

                    stub.restore();
                    done();
                });
            });

            it("should return an address when no park or glassContainer is found", (done) => {
                var stub = sinon.stub(service, "getPointWithin");
                stub.onFirstCall().resolves();

                var stub2 = sinon.stub(service, "getPointNearby");
                stub2.onFirstCall().resolves();

                coordinateService.expects("reverseGeocode").resolves(dummyReverseGeocode);

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(dummyReverseGeocode[0].straatnmid.toString());
                    expect(result.street).toEqual(dummyReverseGeocode[0].straatnm);
                    expect(result.postal).toEqual(dummyReverseGeocode[0].postcode);
                    expect(result.locationType).toEqual("street");

                    stub.restore();
                    stub2.restore();
                    done();
                });
            });

            it("should return a bicycle route location when no park, glasscontainer and street was found + correct properties", (done) => {
                var stub = sinon.stub(service, "getPointWithin");
                stub.onFirstCall().resolves();

                var stub2 = sinon.stub(service, "getPointNearby");
                stub2.onFirstCall().resolves();

                coordinateService.expects("reverseGeocode").resolves();
                stub2.onSecondCall().resolves(dummyBicycleRouteResult);

                const lng = "123";
                const lat = "321";
                service.getLocation(lng, lat).then((result) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(dummyBicycleRouteResult.features[0].attributes.ObjectID.toString());
                    expect(result.street).toEqual(dummyBicycleRouteResult.features[0].attributes.STRAAT);
                    expect(result.postal).toEqual(dummyBicycleRouteResult.features[0].attributes.postcode_links);
                    expect(result.locationType).toEqual("bicycleroute");
                    stub.restore();
                    stub2.restore();
                    done();
                });
            });

            it("should return a regional route location when no park, no glasscontainer, address or bicycle route was found + correct properties", (done) => {
                var stub = sinon.stub(service, "getPointWithin");
                stub.resolves();

                var stub2 = sinon.stub(service, "reverseGeocode");
                stub2.resolves();

                var stub3 = sinon.stub(service, "getPointNearby");
                stub3.onFirstCall().resolves();
                stub3.onSecondCall().resolves();
                stub3.onThirdCall().resolves(dummyRegionalRoad);

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    const regionalRoad = dummyRegionalRoad.features[0];
                    expect(result).not.toBeNull();
                    expect(result.id).toEqual(regionalRoad.attributes.OBJECTID.toString());
                    expect(result.street).toEqual(regionalRoad.attributes.LSTRNM);
                    expect(result.name).toEqual(regionalRoad.attributes.LSTRNM);
                    expect(result.locationType).toEqual("regionalroad");

                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                    done();
                });
            });

            it("should return no result when nothing was found", (done) => {
                var stub = sinon.stub(service, "getPointWithin");
                stub.resolves();

                var stub2 = sinon.stub(service, "getPointNearby");
                stub2.onFirstCall().resolves();
                stub2.onSecondCall().resolves();
                stub2.onThirdCall().resolves();

                var stub3 = sinon.stub(service, "reverseGeocode");
                stub3.resolves();

                const lng = "123";
                const lat = "321";

                service.getLocation(lng, lat).then((result) => {
                    expect(result).toBeUndefined();

                    stub.restore();
                    stub2.restore();
                    stub3.restore();

                    done();
                });
            });
        });
    });
});
