import { MigrationInterface, QueryRunner } from "typeorm";

export class V7Table1742977890919 implements MigrationInterface {
    name = 'V7Table1742977890919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ADD "organization_id" uuid NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_f8ecc7ec626447558ac9582b29d" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_f8ecc7ec626447558ac9582b29d"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "organization_id"`);
    }

}
