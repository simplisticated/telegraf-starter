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
        type: "datetime",
        nullable: false,
    })
    created!: Date;

    @UpdateDateColumn({
        type: "datetime",
        nullable: true,
    })
    updated!: Date | null;

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
    last_name!: string | null;

    @Column({
        type: "text",
        nullable: true,
    })
    username!: string | null;

    @Column({
        type: "text",
        nullable: true,
    })
    language_code!: string | null;

    @Column({
        type: "boolean",
        nullable: false,
        default: false,
    })
    is_premium!: boolean;

    @OneToMany(() => UserModel, user => user.telegramProfile)
    users!: UserModel[];
}
