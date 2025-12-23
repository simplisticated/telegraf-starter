import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from "typeorm";
import UpdateModel from "./update";

@Entity({
    name: "Message",
})
export default class MessageModel {
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
    updated?: Date;

    @OneToOne(() => UpdateModel, update => update.message, {
        nullable: false,
    })
    update!: UpdateModel;
}
