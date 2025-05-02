import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migration: Enhanced Inventory Features
 * 
 * This migration adds new features to the inventory system:
 * - Inventory movement tracking and history
 * - Low stock alerts and reorder point management
 * - Barcode/QR code support
 * - Enhanced categorization and tagging
 */
export class EnhancedInventoryFeatures1714452000000 implements MigrationInterface {
    name = 'EnhancedInventoryFeatures1714452000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create inventory_transactions table for movement tracking
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS inventory_transactions (
                id SERIAL PRIMARY KEY,
                transaction_type VARCHAR(50) NOT NULL,
                item_id INTEGER REFERENCES items(id) NOT NULL,
                warehouse_id INTEGER REFERENCES warehouses(id) NOT NULL,
                storage_location_id INTEGER REFERENCES storage_locations(id),
                lot_id INTEGER REFERENCES lot_tracking(id),
                serial_number_id INTEGER REFERENCES serial_numbers(id),
                quantity DECIMAL(10, 2) NOT NULL,
                reference_type VARCHAR(50),
                reference_id INTEGER,
                notes TEXT,
                performed_by INTEGER REFERENCES users(id),
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS inventory_transactions_item_id_idx ON inventory_transactions(item_id);
            CREATE INDEX IF NOT EXISTS inventory_transactions_warehouse_id_idx ON inventory_transactions(warehouse_id);
            CREATE INDEX IF NOT EXISTS inventory_transactions_transaction_date_idx ON inventory_transactions(transaction_date);
            CREATE INDEX IF NOT EXISTS inventory_transactions_reference_idx ON inventory_transactions(reference_type, reference_id);
        `);

        // Add reorder point management fields to items table
        await queryRunner.query(`
            ALTER TABLE items
            ADD COLUMN IF NOT EXISTS reorder_point DECIMAL(10, 2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS reorder_quantity DECIMAL(10, 2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS critical_threshold DECIMAL(10, 2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS auto_reorder BOOLEAN DEFAULT FALSE;
        `);

        // Add barcode/QR code support to items and serial_numbers
        await queryRunner.query(`
            ALTER TABLE items
            ADD COLUMN IF NOT EXISTS barcode VARCHAR(100),
            ADD COLUMN IF NOT EXISTS barcode_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS qr_code_data TEXT;

            ALTER TABLE serial_numbers
            ADD COLUMN IF NOT EXISTS barcode VARCHAR(100),
            ADD COLUMN IF NOT EXISTS qr_code_data TEXT;

            ALTER TABLE lot_tracking
            ADD COLUMN IF NOT EXISTS barcode VARCHAR(100),
            ADD COLUMN IF NOT EXISTS qr_code_data TEXT;
        `);

        // Enhanced categorization with tags and attributes
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS item_tags (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                color VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE UNIQUE INDEX IF NOT EXISTS item_tags_name_idx ON item_tags(name);

            CREATE TABLE IF NOT EXISTS item_tag_assignments (
                item_id INTEGER REFERENCES items(id) NOT NULL,
                tag_id INTEGER REFERENCES item_tags(id) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (item_id, tag_id)
            );

            CREATE TABLE IF NOT EXISTS item_attributes (
                id SERIAL PRIMARY KEY,
                item_id INTEGER REFERENCES items(id) NOT NULL,
                attribute_name VARCHAR(100) NOT NULL,
                attribute_value TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS item_attributes_item_id_idx ON item_attributes(item_id);
            CREATE INDEX IF NOT EXISTS item_attributes_name_idx ON item_attributes(attribute_name);
        `);

        // Add inventory alerts table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS inventory_alerts (
                id SERIAL PRIMARY KEY,
                alert_type VARCHAR(50) NOT NULL,
                item_id INTEGER REFERENCES items(id) NOT NULL,
                warehouse_id INTEGER REFERENCES warehouses(id),
                message TEXT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                is_acknowledged BOOLEAN DEFAULT FALSE,
                acknowledged_by INTEGER REFERENCES users(id),
                acknowledged_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS inventory_alerts_item_id_idx ON inventory_alerts(item_id);
            CREATE INDEX IF NOT EXISTS inventory_alerts_is_active_idx ON inventory_alerts(is_active);
        `);

        // Update triggers for updated_at timestamps
        await queryRunner.query(`
            -- Triggers for new tables
            DROP TRIGGER IF EXISTS update_inventory_transactions_timestamp ON inventory_transactions;
            CREATE TRIGGER update_inventory_transactions_timestamp
            BEFORE UPDATE ON inventory_transactions
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

            DROP TRIGGER IF EXISTS update_item_tags_timestamp ON item_tags;
            CREATE TRIGGER update_item_tags_timestamp
            BEFORE UPDATE ON item_tags
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

            DROP TRIGGER IF EXISTS update_item_attributes_timestamp ON item_attributes;
            CREATE TRIGGER update_item_attributes_timestamp
            BEFORE UPDATE ON item_attributes
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

            DROP TRIGGER IF EXISTS update_inventory_alerts_timestamp ON inventory_alerts;
            CREATE TRIGGER update_inventory_alerts_timestamp
            BEFORE UPDATE ON inventory_alerts
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS inventory_alerts;`);
        await queryRunner.query(`DROP TABLE IF EXISTS item_attributes;`);
        await queryRunner.query(`DROP TABLE IF EXISTS item_tag_assignments;`);
        await queryRunner.query(`DROP TABLE IF EXISTS item_tags;`);
        await queryRunner.query(`DROP TABLE IF EXISTS inventory_transactions;`);

        // Remove columns from existing tables
        await queryRunner.query(`
            ALTER TABLE items
            DROP COLUMN IF EXISTS reorder_point,
            DROP COLUMN IF EXISTS reorder_quantity,
            DROP COLUMN IF EXISTS critical_threshold,
            DROP COLUMN IF EXISTS auto_reorder,
            DROP COLUMN IF EXISTS barcode,
            DROP COLUMN IF EXISTS barcode_type,
            DROP COLUMN IF EXISTS qr_code_data;
        `);

        await queryRunner.query(`
            ALTER TABLE serial_numbers
            DROP COLUMN IF EXISTS barcode,
            DROP COLUMN IF EXISTS qr_code_data;
        `);

        await queryRunner.query(`
            ALTER TABLE lot_tracking
            DROP COLUMN IF EXISTS barcode,
            DROP COLUMN IF EXISTS qr_code_data;
        `);
    }
}