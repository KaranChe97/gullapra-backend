import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", (request: Request, res: Response, next: NextFunction) => {
    res.send({
        hostname: request.hostname,
        path: request.path,
        method: request.method,
        body:request.body
      });
    
});


export default router;