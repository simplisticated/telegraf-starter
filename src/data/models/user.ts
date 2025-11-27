import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { createUserState, UserState } from "../types/user-state";
import TelegramProfileModel from "./telegram-profile";

@Entity({
    name: "User",
})
export default class UserModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({
        type: "datetime",
        nullable: false,
    })
    creation_date!: Date;

    @UpdateDateColumn({
        type: "datetime",
        nullable: true,
    })
    modification_date?: Date;

    @Column({
        type: "boolean",
        nullable: false,
        default: false,
    })
    is_administrator!: boolean;

    @Column({
        type: "boolean",
        nullable: false,
        default: false,
    })
    is_blocked!: boolean;

    @Column({
        type: "json",
        nullable: false,
        default: JSON.stringify(createUserState()),
    })
    state!: UserState;

    @OneToOne(() => TelegramProfileModel, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    telegramProfile?: TelegramProfileModel;
}
