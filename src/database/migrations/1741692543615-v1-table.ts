import { MigrationInterface, QueryRunner } from "typeorm";

export class V1Table1741692543615 implements MigrationInterface {
    name = 'V1Table1741692543615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30" UNIQUE ("user_id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying, "last_name" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying, "password" character varying, "phone" character varying, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "network" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f8264c2d37cbbd8282ee9a3c97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."patient_gender_identity_enum" AS ENUM('male', 'female', 'transgender-male', 'transgender-female', 'non-binary', 'other', 'prefer-not-to-say')`);
        await queryRunner.query(`CREATE TYPE "public"."patient_biological_sex_enum" AS ENUM('male', 'female', 'intersex', 'unknown')`);
        await queryRunner.query(`CREATE TABLE "patient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "network_id" uuid NOT NULL, "upid" character varying(50) NOT NULL, "abha" character varying(50), "mrn" character varying(50), "identifier" json, "name_prefix" character varying(10), "name_given" character varying(100) NOT NULL, "name_middle" character varying(100), "name_family" character varying(100) NOT NULL, "name_suffix" character varying(10), "preferred_name" character varying(100), "birth_date" date NOT NULL, "death_date" date, "gender_identity" "public"."patient_gender_identity_enum", "biological_sex" "public"."patient_biological_sex_enum", "preferred_pronouns" character varying(50), "address" json, "contact" json, "preferred_language" character varying(50), "interpreter_required" boolean NOT NULL DEFAULT false, "marital_status" character varying(50), "race" json, "ethnicity" character varying(50), "emergency_contacts" json, "preferred_pharmacy" uuid, "primary_care_provider" uuid, "active" boolean NOT NULL DEFAULT true, "preferences" json, "blood_type" character varying(10), "organ_donor" boolean, "advance_directives" json, "created_by" uuid NOT NULL, "updated_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_d4aa2c6437fa81014360167b66f" UNIQUE ("network_id", "upid"), CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_36d0623a2982478eaa9085b810c" FOREIGN KEY ("network_id") REFERENCES "network"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_ac1d33b19b9a70093396ba02f6e" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_15c90ad13dec8f9b73e2e928285" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_15c90ad13dec8f9b73e2e928285"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_ac1d33b19b9a70093396ba02f6e"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_36d0623a2982478eaa9085b810c"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
        await queryRunner.query(`DROP TABLE "patient"`);
        await queryRunner.query(`DROP TYPE "public"."patient_biological_sex_enum"`);
        await queryRunner.query(`DROP TYPE "public"."patient_gender_identity_enum"`);
        await queryRunner.query(`DROP TABLE "network"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
    }

}
