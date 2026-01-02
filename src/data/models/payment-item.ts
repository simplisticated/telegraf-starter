import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import PaymentModel from "./payment";

@Entity({
    name: "PaymentItem",
})
export default class PaymentItemModel {
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
    product_id!: string;

    @Column({
        type: "integer",
        nullable: false,
    })
    unit_count!: number;

    @Column({
        type: "integer",
        nullable: false,
    })
    price_per_unit!: number;

    @Column({
        type: "integer",
        nullable: false,
    })
    total_price!: number;

    @ManyToOne(() => PaymentModel, payment => payment.items)
    @JoinColumn({
        name: "payment_id",
    })
    payment!: PaymentModel;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
