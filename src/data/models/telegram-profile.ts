import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import UserModel from "./user";

@Entity({
    name: "TelegramProfile",
})
export default class TelegramProfileModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "integer",
        nullable: false,
    })
    creation_date!: Date;

    @Column({
        type: "integer",
        nullable: true,
    })
    modification_date?: Date;

    @Column({
        type: "integer",
        nullable: false,
        unique: true,
    })
    telegram_id!: number;

    @Column({
        type: "boolean",
        nullable: false,
    })
    is_bot!: boolean;

    @Column({
        type: "text",
        nullable: false,
    })
    first_name!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    last_name?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    username?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    language_code?: string;

    @Column({
        type: "boolean",
        nullable: false,
        default: false,
    })
    is_premium!: boolean;

    @OneToOne(() => UserModel, user => user.telegramProfile, {
        nullable: false,
    })
    user!: UserModel;
}
