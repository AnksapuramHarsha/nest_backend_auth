import { MigrationInterface, QueryRunner } from "typeorm";

export class V4Table1743071326588 implements MigrationInterface {
    name = 'V4Table1743071326588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d8f3934760efc66ab3c8f4f2b"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "preferred_pharmacy"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "primary_care_provider"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ADD "primary_care_provider" uuid`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "preferred_pharmacy" uuid`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d8f3934760efc66ab3c8f4f2b" FOREIGN KEY ("status_id") REFERENCES "patient_registration_status"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
