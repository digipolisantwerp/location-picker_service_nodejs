import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../types';
import { createLocationService } from './location.service';
import { createCoordinateService } from './coordinate.service';
import { CoordinateServiceConfig, LocationServiceConfig } from './types';

const locationSearchController = (config: LocationServiceConfig) => {
    const service = createLocationService(config);
    return (req: Request, res: Response, next: NextFunction) => {
        service(req.query.search, req.query.types).then((result: LocationItem[]) => {
            res.json(result);
        }).catch((error: any) => {
            next(error);
        });
    };
};

export let locationSearch = locationSearchController;

const coordinateSearchController = (config: CoordinateServiceConfig) => {
    const service = createCoordinateService(config);
    return (req: Request, res: Response, next: NextFunction) => {
        service(req.query.lon, req.query.lat).then((result: LocationItem) => {
            console.log('---------------------------------------------');
            console.log(result);
            console.log('---------------------------------------------');
            res.json(result);
        }).catch((error: any) => {
            next(error);
        });
    };
};

export let coordinateSearch = coordinateSearchController;
