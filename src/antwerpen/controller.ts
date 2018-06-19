import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../types';
import createService = require('./service');
import { ServiceConfig } from './types';

const createController = (config: ServiceConfig) => {
    const service = createService(config);
    return (req: Request, res: Response, next: NextFunction) => {
        service(req.query.search, req.query.types).then((result: LocationItem[]) => {
            res.json(result);
        }).catch((error: any) => {
            next(error);
        });
    };
};

export = createController;
