import { Request, Response, NextFunction } from 'express';
export default function AsyncWrapper(callback: any): any {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
