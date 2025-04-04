import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "User",
})
export default class UserModel {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        type: "integer",
        nullable: false,
    })
    declare creation_date: Date;

    @Column({
        type: "integer",
        nullable: true,
    })
    declare modification_date?: Date;

    @Column({
        type: "integer",
        nullable: false,
        unique: true,
    })
    declare telegram_id: number;

    @Column({
        type: "boolean",
        nullable: false,
    })
    declare is_bot: boolean;

    @Column({
        type: "text",
        nullable: false,
    })
    declare first_name: string;

    @Column({
        type: "text",
        nullable: true,
    })
    declare last_name?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    declare username?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    declare language_code?: string;

    @Column({
        type: "boolean",
        nullable: false,
        default: false,
    })
    declare is_premium: boolean;

    @Column({
        type: "json",
        nullable: false,
        default: createEmptyUserState(),
    })
    declare state: UserState;
}

export type UserState = {
    startCount: number;
};

function createEmptyUserState(): UserState {
    return {
        startCount: 0,
    };
}
