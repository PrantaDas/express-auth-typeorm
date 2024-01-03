import { NextFunction, Response } from "express";
import { Req } from "../types";
import config from "../config/config";
import decodeAuthToken from "../utils/decodeAuthToken";

export const checkAuth = async (req: Req, res: Response, next: NextFunction) => {
    try {
        const token = req?.cookies?.[config.cookieName];
        if (!token) return res.status(401).send({ message: "Unauthorized" });
        const user = await decodeAuthToken(token);
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).send({ message: "Unauthorized" });
    }
};