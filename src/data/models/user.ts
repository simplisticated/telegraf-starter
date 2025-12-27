import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    BeforeInsert,
} from "typeorm";
import { createUserState, UserState } from "../types/user-state";
import TelegramProfileModel from "./telegram-profile";
import BotModel from "./bot";

@Entity({
    name: "User",
})
export default class UserModel {
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
        type: "jsonb",
        nullable: false,
    })
    state!: UserState;

    @ManyToOne(() => BotModel, bot => bot.users, {
        nullable: false,
    })
    @JoinColumn({
        name: "bot_id",
    })
    bot!: BotModel;

    @ManyToOne(() => TelegramProfileModel, {
        nullable: false,
    })
    @JoinColumn({
        name: "telegram_profile_id",
    })
    telegramProfile!: TelegramProfileModel;

    @BeforeInsert()
    private initialize() {
        if (!this.state) {
            this.state = createUserState();
        }
    }
}
