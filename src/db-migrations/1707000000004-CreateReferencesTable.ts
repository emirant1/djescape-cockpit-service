import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateReferencesTable1707000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE cockpit.references (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                url VARCHAR(500) NOT NULL,
                description TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS cockpit.references`);
    }
}
