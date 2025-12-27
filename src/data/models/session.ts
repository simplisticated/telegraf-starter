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
        type: "jsonb",
        nullable: true,
    })
    state?: any;
}
