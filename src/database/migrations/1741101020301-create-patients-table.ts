import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE patients (
        patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        upid VARCHAR(50) UNIQUE NOT NULL,
        abha_no VARCHAR(50) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        date_of_birth DATE,
        gender VARCHAR(20),
        mobile_number VARCHAR(15) NOT NULL,
        mobile_verified BOOLEAN DEFAULT FALSE,
        address JSONB,
        duplicate_flag BOOLEAN DEFAULT FALSE,
        registration_mode VARCHAR(10) DEFAULT 'online',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE patients`);
  }
}
