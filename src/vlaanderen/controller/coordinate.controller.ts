
import { NextFunction, Request, Response } from 'express';

import { LocationItem } from '../../types';
import { getByCoordinates } from '../services/coordinate.service';
import { CoordinateServiceConfig as Config } from '../types';

const coordinateSearchController = (config: Config) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getByCoordinates(req.query, config);
      return res.json({ location: result });
    } catch (error) {
      return next(error);
    }
  };
};

export default coordinateSearchController;
