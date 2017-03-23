import { Request, Response, NextFunction } from 'express';

interface RouteParams {
  req: Request;
  res: Response;
  next: NextFunction;
}

export default RouteParams;
