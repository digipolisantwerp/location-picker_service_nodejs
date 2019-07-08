
import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../../types';
import { queryLocation } from '../services/location.service';
import { LocationServiceConfig as Config } from '../types';

const locationSearchController = (config: Config) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await queryLocation(req.query, config);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  };
};

export default locationSearchController;
