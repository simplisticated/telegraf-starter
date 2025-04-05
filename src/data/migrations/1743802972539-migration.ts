import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743802972539 implements MigrationInterface {
    name = 'Migration1743802972539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "creation_date" integer NOT NULL, "modification_date" integer, "telegram_id" integer NOT NULL, "is_bot" boolean NOT NULL, "first_name" text NOT NULL, "last_name" text, "username" text, "language_code" text, "is_premium" boolean NOT NULL DEFAULT (0), "state" json NOT NULL DEFAULT ('{"startCount":0}'), CONSTRAINT "UQ_bce198743dd9780ba68a7f606b3" UNIQUE ("telegram_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
