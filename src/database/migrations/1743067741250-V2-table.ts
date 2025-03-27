import { MigrationInterface, QueryRunner } from "typeorm";

export class V2Table1743067741250 implements MigrationInterface {
    name = 'V2Table1743067741250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ADD "registration_status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "registration_status"`);
    }

}
