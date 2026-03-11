import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsTable1707000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE cockpit.events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                event_date VARCHAR(50) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}