import { NextFunction, Response } from "express";
import { Req } from "../types";

export default function checkRole(roles: Array<string>) {
    return async (req: Req, res: Response, next: NextFunction) => {
        try {
            if (roles.includes(req.user.role)) return next();
            else throw new Error('Unauthorized');
        }
        catch (err) {
            console.log(err);
            return res.status(401).send({ message: 'Unauthorized' });
        }
    };
}