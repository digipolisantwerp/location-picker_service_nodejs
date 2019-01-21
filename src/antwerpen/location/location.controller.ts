import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../../types';
import createLocationService = require ('./location.service');
import { LocationServiceConfig } from '../types';

const locationSearchController = (config: LocationServiceConfig) => {
    const service = createLocationService(config);
    return (req: Request, res: Response, next: NextFunction) => {
        service(req.query.search, req.query.types, req.query.sort).then((result: LocationItem[]) => {
            res.json(result);
        }).catch((error: any) => {
            next(error);
        });
    };
};

export = locationSearchController;
