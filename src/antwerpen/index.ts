import {locationService, locationSearchController} from './location';
import {coordinateService, coordinateSearchController} from './coordinate';
// get rid of TS4082 error
import * as express from 'express';

export = {
    locationService,
    locationSearchController,
    coordinateService,
    coordinateSearchController,
    // deprecated API provided for backwards compatibility
    createController: locationSearchController,
    createService: locationService
};
