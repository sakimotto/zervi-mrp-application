import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migration: Enhanced Inventory Features
 * 
 * This migration extends the existing inventory schema with specialized features:
 * - Serial number tracking
 * - Fabric roll management with split functionality
 * - Enhanced lot tracking capabilities
 */
export class EnhancedInventoryFeatures1719637900000 implements MigrationInterface {
    name = 'EnhancedInventoryFeatures1719637900000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add specialized tracking columns to items table
        await queryRunner.query(`
            ALTER TABLE item
            ADD COLUMN IF NOT EXISTS track_batches BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS track_serials BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS allow_split BOOLEAN DEFAULT FALSE;
        `);

        // Add supplier batch number and additional fields to lot_tracking
        await queryRunner.query(`
            ALTER TABLE lot_tracking
            ADD COLUMN IF NOT EXISTS supplier_batch_number VARCHAR(100),
            ADD COLUMN IF NOT EXISTS quantity DECIMAL(10, 2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS remaining_quantity DECIMAL(10, 2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'In Stock',
            ADD COLUMN IF NOT EXISTS parent_lot_id INTEGER,
            ADD COLUMN IF NOT EXISTS notes TEXT;
        `);

        // Create serial_numbers table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS serial_numbers (
                id SERIAL PRIMARY KEY,
                serial_number VARCHAR(100) NOT NULL,
                item_id INTEGER REFERENCES item(id) NOT NULL,
                lot_id INTEGER REFERENCES lot_tracking(id),
                status VARCHAR(50) DEFAULT 'available',
                location VARCHAR(255),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS serial_numbers_serial_number_idx ON serial_numbers(serial_number);
            CREATE INDEX IF NOT EXISTS serial_numbers_item_id_idx ON serial_numbers(item_id);
            CREATE INDEX IF NOT EXISTS serial_numbers_lot_id_idx ON serial_numbers(lot_id);
        `);

        // Create fabric_rolls table for specialized fabric tracking
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS fabric_rolls (
                id SERIAL PRIMARY KEY,
                lot_id INTEGER REFERENCES lot_tracking(id) NOT NULL,
                serial_number_id INTEGER REFERENCES serial_numbers(id),
                quantity DECIMAL(10, 2) NOT NULL,
                width DECIMAL(10, 2),
                status VARCHAR(50) DEFAULT 'In Stock',
                location VARCHAR(255),
                notes TEXT,
                parent_roll_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_parent_roll FOREIGN KEY (parent_roll_id) REFERENCES fabric_rolls(id)
            );
            CREATE INDEX IF NOT EXISTS fabric_rolls_lot_id_idx ON fabric_rolls(lot_id);
            CREATE INDEX IF NOT EXISTS fabric_rolls_serial_number_id_idx ON fabric_rolls(serial_number_id);
        `);

        // Update triggers for updated_at timestamps
        await queryRunner.query(`
            -- Function to update timestamp
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Triggers for new tables
            DROP TRIGGER IF EXISTS update_serial_numbers_timestamp ON serial_numbers;
            CREATE TRIGGER update_serial_numbers_timestamp
            BEFORE UPDATE ON serial_numbers
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

            DROP TRIGGER IF EXISTS update_fabric_rolls_timestamp ON fabric_rolls;
            CREATE TRIGGER update_fabric_rolls_timestamp
            BEFORE UPDATE ON fabric_rolls
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop new tables in reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS fabric_rolls;`);
        await queryRunner.query(`DROP TABLE IF EXISTS serial_numbers;`);

        // Remove columns from existing tables
        await queryRunner.query(`
            ALTER TABLE item
            DROP COLUMN IF EXISTS track_batches,
            DROP COLUMN IF EXISTS track_serials,
            DROP COLUMN IF EXISTS allow_split;
        `);

        await queryRunner.query(`
            ALTER TABLE lot_tracking
            DROP COLUMN IF EXISTS supplier_batch_number,
            DROP COLUMN IF EXISTS quantity,
            DROP COLUMN IF EXISTS remaining_quantity,
            DROP COLUMN IF EXISTS status,
            DROP COLUMN IF EXISTS parent_lot_id,
            DROP COLUMN IF EXISTS notes;
        `);
    }
}