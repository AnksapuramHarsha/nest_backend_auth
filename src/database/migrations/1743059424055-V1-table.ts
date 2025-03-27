import { MigrationInterface, QueryRunner } from "typeorm";

export class V1Table1743059424055 implements MigrationInterface {
    name = 'V1Table1743059424055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30" UNIQUE ("user_id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying, "last_name" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying, "password" character varying, "phone" character varying, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying(100) NOT NULL, "key" character varying(100) NOT NULL, "value" jsonb NOT NULL, "metadata" jsonb, "network_id" uuid, "organization_id" uuid, "department_id" character varying, "user_id" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9173e54df2f150f0a8bb2e4034" ON "configurations" ("category") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c658898252e3694655de8a07e" ON "configurations" ("key") `);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "network_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "networks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61b1ee921bf79550d9d4742b9f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patient_registration_status" ("status_id" SERIAL NOT NULL, "status_code" character varying(50) NOT NULL, "status_name" character varying(100) NOT NULL, "status_description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f9ffe3d712d4f8978146350d929" UNIQUE ("status_code"), CONSTRAINT "PK_b4dc57cb92129f43f7343f88b4f" PRIMARY KEY ("status_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."patient_gender_identity_enum" AS ENUM('male', 'female', 'transgender-male', 'transgender-female', 'non-binary', 'other', 'prefer-not-to-say')`);
        await queryRunner.query(`CREATE TYPE "public"."patient_biological_sex_enum" AS ENUM('male', 'female', 'intersex', 'unknown')`);
        await queryRunner.query(`CREATE TABLE "patient" ("upid" character varying(50) NOT NULL, "network_id" uuid NOT NULL, "abha" character varying(50), "mrn" character varying(50), "identifier" json, "name_prefix" character varying(10), "name_given" character varying(100) NOT NULL, "name_middle" character varying(100), "name_family" character varying(100) NOT NULL, "name_suffix" character varying(10), "preferred_name" character varying(100), "birth_date" date NOT NULL, "death_date" date, "gender_identity" "public"."patient_gender_identity_enum", "biological_sex" "public"."patient_biological_sex_enum", "preferred_pronouns" character varying(50), "address" json, "contact" json, "phone_verified" boolean NOT NULL DEFAULT false, "phone_verified_at" TIMESTAMP, "email_verified" boolean NOT NULL DEFAULT false, "email_verified_at" TIMESTAMP, "preferred_language" character varying(50), "interpreter_required" boolean NOT NULL DEFAULT false, "marital_status" character varying(50), "race" json, "ethnicity" character varying(50), "emergency_contacts" json, "preferred_pharmacy" uuid, "primary_care_provider" uuid, "active" boolean NOT NULL DEFAULT true, "preferences" json, "blood_type" character varying(10), "organ_donor" boolean, "advance_directives" json, "status_id" integer, "created_by" uuid NOT NULL, "updated_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "translations" json, "organization_id" uuid NOT NULL, CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f" UNIQUE ("network_id", "upid"), CONSTRAINT "PK_cd7ca5452c886adb42405354b97" PRIMARY KEY ("upid"))`);
        await queryRunner.query(`CREATE TABLE "patient_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL, "name_given" character varying NOT NULL, "name_family" character varying NOT NULL, "preferred_name" character varying NOT NULL, "patient_upid" character varying(50), CONSTRAINT "PK_4b9281b1e9988140f1f23f46b3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "configurations" ADD CONSTRAINT "FK_1944b351fc339a112575d5fb353" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "configurations" ADD CONSTRAINT "FK_988c6298ac906c7a8d47b751159" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_500d1bc22abafc33da6281deabf" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_f8ecc7ec626447558ac9582b29d" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d0623a2982478eaa9085b810c" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_ac1d33b19b9a70093396ba02f6e" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_15c90ad13dec8f9b73e2e928285" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d8f3934760efc66ab3c8f4f2b" FOREIGN KEY ("status_id") REFERENCES "patient_registration_status"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_translation" ADD CONSTRAINT "FK_c328fafa1ef0c8cec962c1bea79" FOREIGN KEY ("patient_upid") REFERENCES "patient"("upid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_translation" DROP CONSTRAINT "FK_c328fafa1ef0c8cec962c1bea79"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d8f3934760efc66ab3c8f4f2b"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_15c90ad13dec8f9b73e2e928285"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_ac1d33b19b9a70093396ba02f6e"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d0623a2982478eaa9085b810c"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_f8ecc7ec626447558ac9582b29d"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_500d1bc22abafc33da6281deabf"`);
        await queryRunner.query(`ALTER TABLE "configurations" DROP CONSTRAINT "FK_988c6298ac906c7a8d47b751159"`);
        await queryRunner.query(`ALTER TABLE "configurations" DROP CONSTRAINT "FK_1944b351fc339a112575d5fb353"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
        await queryRunner.query(`DROP TABLE "patient_translation"`);
        await queryRunner.query(`DROP TABLE "patient"`);
        await queryRunner.query(`DROP TYPE "public"."patient_biological_sex_enum"`);
        await queryRunner.query(`DROP TYPE "public"."patient_gender_identity_enum"`);
        await queryRunner.query(`DROP TABLE "patient_registration_status"`);
        await queryRunner.query(`DROP TABLE "networks"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c658898252e3694655de8a07e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9173e54df2f150f0a8bb2e4034"`);
        await queryRunner.query(`DROP TABLE "configurations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
    }

}
