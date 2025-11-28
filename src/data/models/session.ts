import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({
    name: "Session",
})
export default class SessionModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "text",
        nullable: false,
        unique: true,
    })
    session_id!: string;

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
        type: "json",
        nullable: true,
    })
    state?: any;
}
