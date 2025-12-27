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
    name: "Bot",
})
export default class BotModel {
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
        type: "text",
        nullable: false,
    })
    username!: string;

    @Column({
        type: "boolean",
        nullable: false,
    })
    can_join_groups!: boolean;

    @Column({
        type: "boolean",
        nullable: false,
    })
    can_read_all_group_messages!: boolean;

    @Column({
        type: "boolean",
        nullable: false,
    })
    supports_inline_queries!: boolean;

    @OneToMany(() => UserModel, user => user.bot)
    users!: UserModel[];
}
