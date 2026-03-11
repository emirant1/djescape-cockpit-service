import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAboutTable1707000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE cockpit.about (
                id SERIAL PRIMARY KEY,
                text VARCHAR(3000) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}