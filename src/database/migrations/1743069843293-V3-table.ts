import { MigrationInterface, QueryRunner } from "typeorm";

export class V3Table1743069843293 implements MigrationInterface {
    name = 'V3Table1743069843293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "registration_status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ADD "registration_status" character varying NOT NULL`);
    }

}
