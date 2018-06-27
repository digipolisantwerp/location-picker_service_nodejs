import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../../types';
import { CoordinateService } from './coordinate.service';
import { CoordinateServiceConfig } from '../types';

const coordinateSearchController = (config: CoordinateServiceConfig) => {
    const service = new CoordinateService(config);
    return (req: Request, res: Response, next: NextFunction) => {
        service.getLocation(req.query.lat, req.query.lng).then((result: LocationItem) => {
            if(!result) {
                return res.end();
            }
            res.json({ location: result });
        }).catch((error: any) => {
            next(error);
        });
    };
};

export = coordinateSearchController;
