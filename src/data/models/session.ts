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
    created!: Date;

    @UpdateDateColumn({
        type: "datetime",
        nullable: true,
    })
    updated?: Date;

    @Column({
        type: "json",
        nullable: true,
    })
    state?: any;
}
