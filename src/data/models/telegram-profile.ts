import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import UserModel from "./user";

@Entity({
    name: "TelegramProfile",
})
export default class TelegramProfileModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({
        type: "timestamp with time zone",
        nullable: false,
    })
    created!: Date;

    @UpdateDateColumn({
        type: "timestamp with time zone",
        nullable: true,
    })
    updated?: Date;

    @Column({
        type: "text",
        nullable: false,
        unique: true,
    })
    telegram_id!: string;

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

    @OneToMany(() => UserModel, user => user.telegramProfile)
    users!: UserModel[];
}
