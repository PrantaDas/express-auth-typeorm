import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(["userName"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    userName: string;

    @Column()
    @Length(8, 20)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    encrypPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkPasswordIsValid(plainText: string) {
        return bcrypt.compareSync(plainText, this.password);
    }
};
