import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743647753599 implements MigrationInterface {
    name = 'Migration1743647753599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TelegramUser" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "creation_date" integer NOT NULL, "modification_date" integer, "telegram_id" integer NOT NULL, "is_bot" boolean NOT NULL, "first_name" text NOT NULL, "last_name" text, "username" text, "language_code" text, "is_premium" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_58be6414074795ba2736f871e87" UNIQUE ("telegram_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "TelegramUser"`);
    }

}
