import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { createUserState, UserState } from "../types/user-state";

@Entity({
    name: "User",
})
export default class UserModel {
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

    @Column({
        type: "json",
        nullable: false,
        default: JSON.stringify(createUserState()),
    })
    state!: UserState;
}
