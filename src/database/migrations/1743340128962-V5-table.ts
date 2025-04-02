import { MigrationInterface, QueryRunner } from "typeorm";

export class V5Table1743340128962 implements MigrationInterface {
    name = 'V5Table1743340128962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "organization_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "network_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "networkId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_294c7a91fb1dc89a6d4ecea6e6b" FOREIGN KEY ("networkId") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_294c7a91fb1dc89a6d4ecea6e6b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "networkId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "network_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organization_id"`);
    }

}
