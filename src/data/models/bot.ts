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
        type: "integer",
        nullable: false,
        unique: true,
    })
    telegram_id!: number;

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
