

import { NextFunction, Request, Response } from "express";

export const trycatch = (routeHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routeHandler(req, res, next);
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        status: "failed",
        error_message: error.message,
      });
    }
  };
};
