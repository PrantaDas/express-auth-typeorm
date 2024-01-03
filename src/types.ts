import { Request } from "express";

export interface Req extends Request {
    user: UserData
}

export type UserData = {
    userName: string;
    id: number;
    role: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}