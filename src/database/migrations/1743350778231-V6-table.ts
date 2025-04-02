import { MigrationInterface, QueryRunner } from "typeorm";

export class V6Table1743350778231 implements MigrationInterface {
    name = 'V6Table1743350778231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_294c7a91fb1dc89a6d4ecea6e6b"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3aa3456c015cd800a734f522d27" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3aa3456c015cd800a734f522d27"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_21a659804ed7bf61eb91688dea7"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f" UNIQUE ("upid", "network_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_294c7a91fb1dc89a6d4ecea6e6b" FOREIGN KEY ("networkId") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
