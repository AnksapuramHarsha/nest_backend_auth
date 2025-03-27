import { MigrationInterface, QueryRunner } from "typeorm";

export class V6Table1742897721325 implements MigrationInterface {
    name = 'V6Table1742897721325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_translation" DROP CONSTRAINT "FK_f710b4e221001476791eb900a37"`);
        await queryRunner.query(`ALTER TABLE "patient_translation" RENAME COLUMN "patient_id" TO "patient_upid"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f"`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "PK_cd7ca5452c886adb42405354b97" PRIMARY KEY ("upid")`);
        await queryRunner.query(`ALTER TABLE "patient_translation" DROP COLUMN "patient_upid"`);
        await queryRunner.query(`ALTER TABLE "patient_translation" ADD "patient_upid" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f" UNIQUE ("network_id", "upid")`);
        await queryRunner.query(`ALTER TABLE "patient_translation" ADD CONSTRAINT "FK_c328fafa1ef0c8cec962c1bea79" FOREIGN KEY ("patient_upid") REFERENCES "patient"("upid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_translation" DROP CONSTRAINT "FK_c328fafa1ef0c8cec962c1bea79"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f"`);
        await queryRunner.query(`ALTER TABLE "patient_translation" DROP COLUMN "patient_upid"`);
        await queryRunner.query(`ALTER TABLE "patient_translation" ADD "patient_upid" uuid`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "PK_cd7ca5452c886adb42405354b97"`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f" UNIQUE ("network_id", "upid")`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "patient_translation" RENAME COLUMN "patient_upid" TO "patient_id"`);
        await queryRunner.query(`ALTER TABLE "patient_translation" ADD CONSTRAINT "FK_f710b4e221001476791eb900a37" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
