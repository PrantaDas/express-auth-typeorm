import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export default async function decodeAuthToken(token: string) {
    if (!token) throw new Error(`Token is ${token}`);
    const decoded: any = jwt.verify(token, config.jwtSecret);
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail({ where: { id: decoded?.id } });
    if (!user) throw new Error('User not found');
    return user;
}