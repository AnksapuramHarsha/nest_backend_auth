import { MigrationInterface, QueryRunner } from "typeorm";

export class V5Table1742552198273 implements MigrationInterface {
    name = 'V5Table1742552198273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ADD "phone_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "phone_verified_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "email_verified_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "email_verified_at"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "phone_verified_at"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "phone_verified"`);
    }

}
