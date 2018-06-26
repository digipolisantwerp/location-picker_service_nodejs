import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../../types';
import createCoordinateService = require('./coordinate.service');
import { CoordinateServiceConfig } from '../types';

const coordinateSearchController = (config: CoordinateServiceConfig) => {
    const service = createCoordinateService(config);
    return (req: Request, res: Response, next: NextFunction) => {
        service(req.query.lng, req.query.lat).then((result: LocationItem) => {
            res.json(result);
        }).catch((error: any) => {
            next(error);
        });
    };
};

export = coordinateSearchController;
