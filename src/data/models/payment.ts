import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    UpdateDateColumn,
} from "typeorm";
import PaymentItemModel from "./payment-item";

@Entity({
    name: "Payment",
})
export default class PaymentModel {
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
        type: "integer",
        nullable: false,
    })
    amount!: number;

    @Column({
        type: "text",
        nullable: false,
    })
    currency!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    comment!: string | null;

    @OneToMany(() => PaymentItemModel, item => item.payment, { cascade: true })
    items!: PaymentItemModel[];

    @Column({
        type: "text",
        nullable: false,
    })
    provider!: string;

    @Column({
        type: "text",
        nullable: false,
    })
    external_id!: string;

    @Column({
        type: "text",
        nullable: false,
    })
    status!: PaymentStatus;

    @UpdateDateColumn({
        type: "datetime",
        nullable: true,
    })
    paid!: Date | null;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
