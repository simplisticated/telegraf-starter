import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766825859187 implements MigrationInterface {
    name = 'Migration1766825859187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TelegramProfile" ("id" SERIAL NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "telegram_id" text NOT NULL, "is_bot" boolean NOT NULL, "first_name" text NOT NULL, "last_name" text, "username" text, "language_code" text, "is_premium" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a0768c06dcfa2f3789387c14e58" UNIQUE ("telegram_id"), CONSTRAINT "PK_b27b6422360338194982dda225d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "is_administrator" boolean NOT NULL DEFAULT false, "is_blocked" boolean NOT NULL DEFAULT false, "state" jsonb NOT NULL, "bot_id" integer NOT NULL, "telegram_profile_id" integer NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Bot" ("id" SERIAL NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "telegram_id" text NOT NULL, "username" text NOT NULL, "can_join_groups" boolean NOT NULL, "can_read_all_group_messages" boolean NOT NULL, "supports_inline_queries" boolean NOT NULL, CONSTRAINT "UQ_894dfeb8bb3555d7c6cf4fcf124" UNIQUE ("telegram_id"), CONSTRAINT "PK_10fe6f238f7e7c16975be102281" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Log" ("id" SERIAL NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "level" text NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_47b43670a34b4d7b35ba994e0df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Session" ("id" SERIAL NOT NULL, "session_id" text NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "state" jsonb, CONSTRAINT "UQ_e5097686c07feae37bebf34c0b1" UNIQUE ("session_id"), CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_35b0895e64ed4299d203d350538" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_8368ae164967f2cfbf2195edb2f" FOREIGN KEY ("telegram_profile_id") REFERENCES "TelegramProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_8368ae164967f2cfbf2195edb2f"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_35b0895e64ed4299d203d350538"`);
        await queryRunner.query(`DROP TABLE "Session"`);
        await queryRunner.query(`DROP TABLE "Log"`);
        await queryRunner.query(`DROP TABLE "Bot"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "TelegramProfile"`);
    }

}
