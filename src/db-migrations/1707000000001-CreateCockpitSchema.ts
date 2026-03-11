import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCockpitSchema1707000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS cockpit`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}