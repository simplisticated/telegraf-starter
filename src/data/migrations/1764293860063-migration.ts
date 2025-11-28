import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764293860063 implements MigrationInterface {
    name = 'Migration1764293860063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "session_id" text NOT NULL, "creation_date" datetime NOT NULL DEFAULT (datetime('now')), "modification_date" datetime DEFAULT (datetime('now')), "state" json, CONSTRAINT "UQ_e5097686c07feae37bebf34c0b1" UNIQUE ("session_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Session"`);
    }

}
