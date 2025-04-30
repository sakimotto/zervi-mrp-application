import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migration: Create Inventory Management Tables
 * 
 * Creates all required tables for inventory management including:
 * - Item categories
 * - Units of measurement
 * - Items
 * - Warehouses
 * - Storage locations
 * - Lot tracking
 * - Serial numbers
 * - Inventory records
 * - Fabric rolls
 */
export class CreateInventoryTables1719637800000 implements MigrationInterface {
    name = 'CreateInventoryTables1719637800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create item_category table
        await queryRunner.query(`
            CREATE TABLE "item_category" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_item_category" PRIMARY KEY ("id")
            )
        `);

        // Create unit_of_measurement table
        await queryRunner.query(`
            CREATE TABLE "unit_of_measurement" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "abbreviation" character varying(10) NOT NULL,
                "description" text,
                "conversion_factor" numeric(10,4) NOT NULL DEFAULT '1',
                "base_unit_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_unit_of_measurement" PRIMARY KEY ("id")
            )
        `);

        // Add self-reference for base units in UOM table
        await queryRunner.query(`
            ALTER TABLE "unit_of_measurement"
            ADD CONSTRAINT "FK_uom_base_unit"
            FOREIGN KEY ("base_unit_id")
            REFERENCES "unit_of_measurement"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Create warehouse table
        await queryRunner.query(`
            CREATE TABLE "warehouse" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "location" character varying(255),
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_warehouse" PRIMARY KEY ("id")
            )
        `);

        // Create storage_location table
        await queryRunner.query(`
            CREATE TABLE "storage_location" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "warehouse_id" integer NOT NULL,
                "aisle" character varying(20),
                "rack" character varying(20),
                "shelf" character varying(20),
                "bin" character varying(20),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_storage_location" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key to storage_location
        await queryRunner.query(`
            ALTER TABLE "storage_location"
            ADD CONSTRAINT "FK_storage_location_warehouse"
            FOREIGN KEY ("warehouse_id")
            REFERENCES "warehouse"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        // Create item table
        await queryRunner.query(`
            CREATE TABLE "item" (
                "id" SERIAL NOT NULL,
                "item_code" character varying(50) NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "category_id" integer,
                "uom_id" integer,
                "minimum_stock_level" numeric(10,2) DEFAULT '0',
                "reorder_point" numeric(10,2) DEFAULT '0',
                "lead_time_days" integer DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "cost_price" numeric(10,2) DEFAULT '0',
                "selling_price" numeric(10,2) DEFAULT '0',
                "item_type" character varying(50) DEFAULT 'standard',
                "track_batches" boolean NOT NULL DEFAULT false,
                "track_serial_numbers" boolean NOT NULL DEFAULT false,
                "can_be_split" boolean NOT NULL DEFAULT false,
                "default_warehouse_id" integer,
                "default_location_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_item" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_item_code" UNIQUE ("item_code")
            )
        `);

        // Add foreign keys to item table
        await queryRunner.query(`
            ALTER TABLE "item"
            ADD CONSTRAINT "FK_item_category"
            FOREIGN KEY ("category_id")
            REFERENCES "item_category"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "item"
            ADD CONSTRAINT "FK_item_uom"
            FOREIGN KEY ("uom_id")
            REFERENCES "unit_of_measurement"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "item"
            ADD CONSTRAINT "FK_item_default_warehouse"
            FOREIGN KEY ("default_warehouse_id")
            REFERENCES "warehouse"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "item"
            ADD CONSTRAINT "FK_item_default_location"
            FOREIGN KEY ("default_location_id")
            REFERENCES "storage_location"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Create lot_tracking table
        await queryRunner.query(`
            CREATE TABLE "lot_tracking" (
                "id" SERIAL NOT NULL,
                "lot_number" character varying(50) NOT NULL,
                "item_id" integer NOT NULL,
                "quantity" numeric(10,2) NOT NULL DEFAULT '0',
                "manufacturing_date" TIMESTAMP,
                "expiration_date" TIMESTAMP,
                "supplier_batch_number" character varying(50),
                "quality_status" character varying(20) NOT NULL DEFAULT 'pending',
                "notes" text,
                "parent_lot_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lot_tracking" PRIMARY KEY ("id")
            )
        `);

        // Add foreign keys to lot_tracking table
        await queryRunner.query(`
            ALTER TABLE "lot_tracking"
            ADD CONSTRAINT "FK_lot_tracking_item"
            FOREIGN KEY ("item_id")
            REFERENCES "item"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "lot_tracking"
            ADD CONSTRAINT "FK_lot_tracking_parent"
            FOREIGN KEY ("parent_lot_id")
            REFERENCES "lot_tracking"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Create serial_number table
        await queryRunner.query(`
            CREATE TABLE "serial_number" (
                "id" SERIAL NOT NULL,
                "serial_number" character varying(50) NOT NULL,
                "item_id" integer NOT NULL,
                "lot_id" integer,
                "status" character varying(20) NOT NULL DEFAULT 'available',
                "notes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_serial_number" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_serial_number" UNIQUE ("serial_number")
            )
        `);

        // Add foreign keys to serial_number table
        await queryRunner.query(`
            ALTER TABLE "serial_number"
            ADD CONSTRAINT "FK_serial_number_item"
            FOREIGN KEY ("item_id")
            REFERENCES "item"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "serial_number"
            ADD CONSTRAINT "FK_serial_number_lot"
            FOREIGN KEY ("lot_id")
            REFERENCES "lot_tracking"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Create inventory table
        await queryRunner.query(`
            CREATE TABLE "inventory" (
                "id" SERIAL NOT NULL,
                "item_id" integer NOT NULL,
                "warehouse_id" integer NOT NULL,
                "location_id" integer,
                "quantity_on_hand" numeric(10,2) NOT NULL DEFAULT '0',
                "quantity_reserved" numeric(10,2) NOT NULL DEFAULT '0',
                "quantity_available" numeric(10,2) NOT NULL DEFAULT '0',
                "last_counted_date" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_inventory" PRIMARY KEY ("id")
            )
        `);

        // Add foreign keys to inventory table
        await queryRunner.query(`
            ALTER TABLE "inventory"
            ADD CONSTRAINT "FK_inventory_item"
            FOREIGN KEY ("item_id")
            REFERENCES "item"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "inventory"
            ADD CONSTRAINT "FK_inventory_warehouse"
            FOREIGN KEY ("warehouse_id")
            REFERENCES "warehouse"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "inventory"
            ADD CONSTRAINT "FK_inventory_location"
            FOREIGN KEY ("location_id")
            REFERENCES "storage_location"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Create fabric_roll table
        await queryRunner.query(`
            CREATE TABLE "fabric_roll" (
                "id" SERIAL NOT NULL,
                "roll_number" character varying(50) NOT NULL,
                "item_id" integer NOT NULL,
                "lot_id" integer,
                "serial_id" integer,
                "quantity" numeric(10,2) NOT NULL DEFAULT '0',
                "width" numeric(10,2),
                "length" numeric(10,2),
                "status" character varying(20) NOT NULL DEFAULT 'available',
                "parent_roll_id" integer,
                "notes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fabric_roll" PRIMARY KEY ("id")
            )
        `);

        // Add foreign keys to fabric_roll table
        await queryRunner.query(`
            ALTER TABLE "fabric_roll"
            ADD CONSTRAINT "FK_fabric_roll_item"
            FOREIGN KEY ("item_id")
            REFERENCES "item"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "fabric_roll"
            ADD CONSTRAINT "FK_fabric_roll_lot"
            FOREIGN KEY ("lot_id")
            REFERENCES "lot_tracking"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "fabric_roll"
            ADD CONSTRAINT "FK_fabric_roll_serial"
            FOREIGN KEY ("serial_id")
            REFERENCES "serial_number"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "fabric_roll"
            ADD CONSTRAINT "FK_fabric_roll_parent"
            FOREIGN KEY ("parent_roll_id")
            REFERENCES "fabric_roll"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX "IDX_item_code" ON "item" ("item_code")`);
        await queryRunner.query(`CREATE INDEX "IDX_lot_number" ON "lot_tracking" ("lot_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_serial_number" ON "serial_number" ("serial_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_roll_number" ON "fabric_roll" ("roll_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_inventory_item_warehouse" ON "inventory" ("item_id", "warehouse_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to respect foreign key constraints
        await queryRunner.query(`DROP INDEX "IDX_inventory_item_warehouse"`);
        await queryRunner.query(`DROP INDEX "IDX_roll_number"`);
        await queryRunner.query(`DROP INDEX "IDX_serial_number"`);
        await queryRunner.query(`DROP INDEX "IDX_lot_number"`);
        await queryRunner.query(`DROP INDEX "IDX_item_code"`);

        await queryRunner.query(`DROP TABLE "fabric_roll"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "serial_number"`);
        await queryRunner.query(`DROP TABLE "lot_tracking"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "storage_location"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`DROP TABLE "unit_of_measurement"`);
        await queryRunner.query(`DROP TABLE "item_category"`);
    }
}
