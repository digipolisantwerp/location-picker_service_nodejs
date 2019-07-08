// get rid of TS4082 error
import * as express from 'express';
import coordinateSearchController from './controller/coordinate.controller';
import locationSearchController from './controller/location.controller';

export default {
  coordinateSearchController,
  locationSearchController,
};
