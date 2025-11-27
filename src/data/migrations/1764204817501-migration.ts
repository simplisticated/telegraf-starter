import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764204817501 implements MigrationInterface {
    name = 'Migration1764204817501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "creation_date" datetime NOT NULL DEFAULT (datetime('now')), "modification_date" datetime DEFAULT (datetime('now')), "is_administrator" boolean NOT NULL DEFAULT (0), "is_blocked" boolean NOT NULL DEFAULT (0), "state" json NOT NULL DEFAULT ('{"messageCount":0}'), "telegramProfileId" integer, CONSTRAINT "REL_25f817db9d37e4cf5d870ef757" UNIQUE ("telegramProfileId"))`);
        await queryRunner.query(`CREATE TABLE "TelegramProfile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "creation_date" datetime NOT NULL DEFAULT (datetime('now')), "modification_date" datetime DEFAULT (datetime('now')), "telegram_id" integer NOT NULL, "is_bot" boolean NOT NULL, "first_name" text NOT NULL, "last_name" text, "username" text, "language_code" text, "is_premium" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_a0768c06dcfa2f3789387c14e58" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "creation_date" datetime NOT NULL DEFAULT (datetime('now')), "modification_date" datetime DEFAULT (datetime('now')), "is_administrator" boolean NOT NULL DEFAULT (0), "is_blocked" boolean NOT NULL DEFAULT (0), "state" json NOT NULL DEFAULT ('{"messageCount":0}'), "telegramProfileId" integer, CONSTRAINT "REL_25f817db9d37e4cf5d870ef757" UNIQUE ("telegramProfileId"), CONSTRAINT "FK_25f817db9d37e4cf5d870ef757d" FOREIGN KEY ("telegramProfileId") REFERENCES "TelegramProfile" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "creation_date", "modification_date", "is_administrator", "is_blocked", "state", "telegramProfileId") SELECT "id", "creation_date", "modification_date", "is_administrator", "is_blocked", "state", "telegramProfileId" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "creation_date" datetime NOT NULL DEFAULT (datetime('now')), "modification_date" datetime DEFAULT (datetime('now')), "is_administrator" boolean NOT NULL DEFAULT (0), "is_blocked" boolean NOT NULL DEFAULT (0), "state" json NOT NULL DEFAULT ('{"messageCount":0}'), "telegramProfileId" integer, CONSTRAINT "REL_25f817db9d37e4cf5d870ef757" UNIQUE ("telegramProfileId"))`);
        await queryRunner.query(`INSERT INTO "User"("id", "creation_date", "modification_date", "is_administrator", "is_blocked", "state", "telegramProfileId") SELECT "id", "creation_date", "modification_date", "is_administrator", "is_blocked", "state", "telegramProfileId" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
        await queryRunner.query(`DROP TABLE "TelegramProfile"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
