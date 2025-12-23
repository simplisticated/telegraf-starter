import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766220928598 implements MigrationInterface {
    name = 'Migration1766220928598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TelegramProfile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime DEFAULT (datetime('now')), "telegram_id" integer NOT NULL, "is_bot" boolean NOT NULL, "first_name" text NOT NULL, "last_name" text, "username" text, "language_code" text, "is_premium" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_a0768c06dcfa2f3789387c14e58" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime DEFAULT (datetime('now')), "is_administrator" boolean NOT NULL DEFAULT (0), "is_blocked" boolean NOT NULL DEFAULT (0), "state" json NOT NULL, "bot_id" integer NOT NULL, "telegram_profile_id" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "Bot" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime DEFAULT (datetime('now')), "telegram_id" integer NOT NULL, "username" text NOT NULL, "can_join_groups" boolean NOT NULL, "can_read_all_group_messages" boolean NOT NULL, "supports_inline_queries" boolean NOT NULL, CONSTRAINT "UQ_894dfeb8bb3555d7c6cf4fcf124" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`CREATE TABLE "Log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "level" text NOT NULL, "message" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "Session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "session_id" text NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime DEFAULT (datetime('now')), "state" json, CONSTRAINT "UQ_e5097686c07feae37bebf34c0b1" UNIQUE ("session_id"))`);
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime DEFAULT (datetime('now')), "is_administrator" boolean NOT NULL DEFAULT (0), "is_blocked" boolean NOT NULL DEFAULT (0), "state" json NOT NULL, "bot_id" integer NOT NULL, "telegram_profile_id" integer NOT NULL, CONSTRAINT "FK_35b0895e64ed4299d203d350538" FOREIGN KEY ("bot_id") REFERENCES "Bot" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8368ae164967f2cfbf2195edb2f" FOREIGN KEY ("telegram_profile_id") REFERENCES "TelegramProfile" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "created", "updated", "is_administrator", "is_blocked", "state", "bot_id", "telegram_profile_id") SELECT "id", "created", "updated", "is_administrator", "is_blocked", "state", "bot_id", "telegram_profile_id" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime DEFAULT (datetime('now')), "is_administrator" boolean NOT NULL DEFAULT (0), "is_blocked" boolean NOT NULL DEFAULT (0), "state" json NOT NULL, "bot_id" integer NOT NULL, "telegram_profile_id" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "User"("id", "created", "updated", "is_administrator", "is_blocked", "state", "bot_id", "telegram_profile_id") SELECT "id", "created", "updated", "is_administrator", "is_blocked", "state", "bot_id", "telegram_profile_id" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
        await queryRunner.query(`DROP TABLE "Session"`);
        await queryRunner.query(`DROP TABLE "Log"`);
        await queryRunner.query(`DROP TABLE "Bot"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "TelegramProfile"`);
    }

}
