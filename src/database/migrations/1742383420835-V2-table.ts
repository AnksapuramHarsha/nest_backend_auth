import { MigrationInterface, QueryRunner } from "typeorm";

export class V2Table1742383420835 implements MigrationInterface {
    name = 'V2Table1742383420835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d0623a2982478eaa9085b810c"`);
        await queryRunner.query(`CREATE TABLE "networks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61b1ee921bf79550d9d4742b9f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "network_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying(100) NOT NULL, "key" character varying(100) NOT NULL, "value" jsonb NOT NULL, "metadata" jsonb, "network_id" uuid, "organization_id" uuid, "department_id" character varying, "user_id" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9173e54df2f150f0a8bb2e4034" ON "configurations" ("category") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c658898252e3694655de8a07e" ON "configurations" ("key") `);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_500d1bc22abafc33da6281deabf" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "configurations" ADD CONSTRAINT "FK_1944b351fc339a112575d5fb353" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "configurations" ADD CONSTRAINT "FK_988c6298ac906c7a8d47b751159" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d0623a2982478eaa9085b810c" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d0623a2982478eaa9085b810c"`);
        await queryRunner.query(`ALTER TABLE "configurations" DROP CONSTRAINT "FK_988c6298ac906c7a8d47b751159"`);
        await queryRunner.query(`ALTER TABLE "configurations" DROP CONSTRAINT "FK_1944b351fc339a112575d5fb353"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_500d1bc22abafc33da6281deabf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c658898252e3694655de8a07e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9173e54df2f150f0a8bb2e4034"`);
        await queryRunner.query(`DROP TABLE "configurations"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "networks"`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d0623a2982478eaa9085b810c" FOREIGN KEY ("network_id") REFERENCES "network"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
