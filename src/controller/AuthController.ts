import { Request, Response } from "express";
import { getRepository, getTreeRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import config from "../config/config";
import { Req } from "../types";
import { validate } from "class-validator";

export default class AuthController {

    static login = async (req: Request, res: Response) => {
        try {
            const { userName, password } = req.body;
            if (!userName || !password) return res.status(400).send({ message: 'Username and password is required' });
            const userRepo = getRepository(User);
            let user = await userRepo.findOneOrFail({ where: { userName } });
            if (!user) return res.status(404).send({ message: 'User does not exist' });
            if (!user.checkPasswordIsValid(password)) return res.status(401).send({ message: 'Unauthorized' });
            const token = jwt.sign({ id: user.id }, config.jwtSecret);
            res.cookie(config.cookieName, token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expires: new Date(Date.now() + 172800000)
            });
            return res.status(200).send(user);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };

    static changePassword = async (req: Req, res: Response) => {
        try {
            const id = req.user.id;
            const { oldPass, newPass } = req.body;
            if (!oldPass || !newPass) return res.status(400).send({ message: 'Old password and new password is required' });
            const userRepo = getTreeRepository(User);
            const user = await userRepo.findOneOrFail({ where: { id } });
            if (!user) return res.status(404).send({ message: 'User does not exist' });
            if (!user.checkPasswordIsValid(oldPass)) return res.status(400).send({ message: 'Your old password is invalid' });
            user.password = newPass;
            const errors = await validate(user);
            if (errors.length > 0) return res.status(400).send(errors);
            user.encrypPassword();
            return res.status(204).send({ message: 'Password updated successfully' });
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };
};