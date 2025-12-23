import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToOne,
} from "typeorm";
import MessageModel from "./message";

@Entity({
    name: "Update",
})
export default class UpdateModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({
        type: "datetime",
        nullable: false,
    })
    created!: Date;

    @Column({
        type: "integer",
        nullable: false,
    })
    chat_id!: number;

    @OneToOne(() => MessageModel, message => message.update, {
        nullable: true,
    })
    message?: MessageModel;

    /* @ManyToOne(() => UserModel, user => user.updates, {
        nullable: false,
    })
    @JoinColumn({
        name: "user_id",
    })
    user!: UserModel; */
}
