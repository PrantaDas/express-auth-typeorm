import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Req, UserData } from "../types";
import { validate } from "class-validator";

export default class UserController {

    static getAll = async (req: Req, res: Response) => {
        try {
            const userRepo = getRepository(User);
            const users = await userRepo.find({
                select: ["id", "userName", "role"]
            });
            return res.status(200).send(users);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };

    static getOne = async (req: Request, res: Response) => {
        try {
            const id: number = Number(req.params.id);
            const userRepo = getRepository(User);
            if (!id) return res.status(400).send({ message: 'Id is required' });
            const user = await userRepo.findOneOrFail({ where: { id } });
            if (!user) return res.status(404).send({ message: 'User not found' });
            return res.status(200).send(user);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };

    static createNew = async (req: Request, res: Response) => {
        try {
            const { userName, role, password } = req.body;
            let user = new User();
            user.userName = userName;
            user.role = role;
            user.password = password;
            const errors = await validate(user);
            if (errors.length > 0) return res.status(400).send(errors);
            user.encrypPassword();
            const userRepo = getRepository(User);
            try {
                await userRepo.save(user);
            }
            catch (err) { return res.status(409).send({ message: 'Username already in use' }) }
            return res.status(201).send({ message: 'User Created successfully' });
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };

    static updateUser = async (req: Req, res: Response) => {
        try {
            const id: number = Number(req.params.id);
            if (!id) return res.status(400).send({ message: 'Id is required' });
            const { userName, role } = req.body;
            const userRepo = getRepository(User);
            let user: UserData;

            user = await userRepo.findOneOrFail({ where: { id } });
            if (!user) return res.status(404).send({ message: 'User does not exist' });
            user.userName = userName;
            user.role = role;

            const errors = await validate(user);

            if (errors.length > 0) return res.status(409).send({ message: 'Username already in use' });

            await userRepo.save(user);
            return res.status(204).send(user);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };

    static deleteUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).send({ message: 'Id is required' });
            const userRepo = getRepository(User);

            const user = await userRepo.findOneOrFail({ where: { id } });
            if (!user) return res.status(404).send({ message: 'User not found' });

            userRepo.delete(id);

            return res.status(204).send({ message: 'User deleted successfully' });
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    };
};