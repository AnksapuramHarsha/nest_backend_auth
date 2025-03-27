import { MigrationInterface, QueryRunner } from "typeorm";

export class V4Table1742442465862 implements MigrationInterface {
    name = 'V4Table1742442465862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_registration_status" ("status_id" SERIAL NOT NULL, "status_code" character varying(50) NOT NULL, "status_name" character varying(100) NOT NULL, "status_description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f9ffe3d712d4f8978146350d929" UNIQUE ("status_code"), CONSTRAINT "PK_b4dc57cb92129f43f7343f88b4f" PRIMARY KEY ("status_id"))`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "status_id" integer`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d8f3934760efc66ab3c8f4f2b" FOREIGN KEY ("status_id") REFERENCES "patient_registration_status"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d8f3934760efc66ab3c8f4f2b"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "status_id"`);
        await queryRunner.query(`DROP TABLE "patient_registration_status"`);
    }

}
