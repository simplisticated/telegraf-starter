import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";
import { LogLevel } from "../../app/console";

@Entity({
    name: "Log",
})
export default class LogModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({
        type: "datetime",
        nullable: false,
    })
    created!: Date;

    @Column({
        type: "text",
        nullable: false,
    })
    level!: LogLevel;

    @Column({
        type: "text",
        nullable: false,
    })
    message!: string;
}
