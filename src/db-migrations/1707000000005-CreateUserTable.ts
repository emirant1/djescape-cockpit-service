import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1707000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TYPE cockpit.user_role_enum AS ENUM ('user', 'admin')`);

        await queryRunner.query(`
            CREATE TABLE cockpit.user (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role cockpit.user_role_enum NOT NULL DEFAULT 'user',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { /* No body required */ }
}