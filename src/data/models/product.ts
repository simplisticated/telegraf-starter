import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({
    name: "Product",
})
export default class ProductModel {
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
    })
    public_id!: string;

    @Column({
        type: "text",
        nullable: false,
    })
    name!: string;

    @Column({
        type: "text",
        nullable: false,
    })
    description!: string;
}
