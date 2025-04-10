# Zervi MRP Application - Item Management Implementation Guide

This document provides step-by-step instructions for implementing the Item Management component in your Zervi MRP Application using Windsurf framework with TypeORM and PostgreSQL.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Implementation Steps](#implementation-steps)
3. [Testing](#testing)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

## Prerequisites

Before beginning implementation, ensure you have:
- Access to your Zervi MRP Application codebase
- Node.js and npm installed
- PostgreSQL database configured
- TypeORM installed and configured
- Basic understanding of Express.js and TypeORM

## Implementation Steps

### Step 1: Create Required Models

#### 1.1 Create/Update Supplier Model
Create a file named `supplier.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";

/**
 * Supplier Entity
 * 
 * Represents suppliers for items in the Zervi MRP system.
 * Suppliers provide raw materials and other items to the company.
 */
@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 1.2 Create/Update Unit of Measurement Model
If not already present, create a file named `unit-of-measurement.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * Unit of Measurement Entity
 * 
 * Represents units of measurement for items in the Zervi MRP system.
 * Examples include pieces, kilograms, meters, etc.
 */
@Entity("units_of_measurement")
export class UnitOfMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 1.3 Create/Update Item Category Model
If not already present, create a file named `item-category.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";

/**
 * Item Category Entity
 * 
 * Represents categories for organizing items in the Zervi MRP system.
 * Categories can be nested with parent-child relationships.
 */
@Entity("item_categories")
export class ItemCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  name: string;

  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: "parent_category_id" })
  parent_category: ItemCategory;

  @Column({ nullable: true })
  parent_category_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 1.4 Create Item Model
Create a file named `item.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { ItemCategory } from "./item-category.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { Supplier } from "./supplier.model";

/**
 * Item Entity
 * 
 * Represents inventory items in the Zervi MRP system.
 * Items can be raw materials, semi-finished goods, or finished products.
 */
@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  item_code: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ["raw_material", "semi_finished", "finished_product"],
    default: "raw_material"
  })
  type: string;

  @ManyToOne(() => ItemCategory)
  @JoinColumn({ name: "category_id" })
  category: ItemCategory;

  @Column()
  category_id: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "uom_id" })
  uom: UnitOfMeasurement;

  @Column()
  uom_id: number;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "default_supplier_id" })
  default_supplier: Supplier;

  @Column({ nullable: true })
  default_supplier_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  min_stock_level: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  reorder_point: number;

  @Column({ default: 0 })
  lead_time_days: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### Step 2: Create Item Controller

Create a file named `item.controller.ts` in your controllers directory:

```typescript
import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { Item } from "../models/item.model";

/**
 * Item Controller
 * 
 * Handles CRUD operations for Item entities in the Zervi MRP system.
 */
export class ItemController {
  /**
   * Get all items with optional filtering
   * 
   * @param req Request object
   * @param res Response object
   */
  async getAll(req: Request, res: Response) {
    try {
      const itemRepository = getRepository(Item);
      
      // Extract query parameters
      const { 
        division_id, 
        category_id, 
        type, 
        search,
        page = 1,
        limit = 10,
        sort_by = "id",
        sort_order = "ASC"
      } = req.query;
      
      // Build query
      let query = itemRepository.createQueryBuilder("item")
        .leftJoinAndSelect("item.division", "division")
        .leftJoinAndSelect("item.category", "category")
        .leftJoinAndSelect("item.uom", "uom")
        .leftJoinAndSelect("item.default_supplier", "supplier");
      
      // Apply filters
      if (division_id) {
        query = query.andWhere("item.division_id = :division_id", { division_id });
      }
      
      if (category_id) {
        query = query.andWhere("item.category_id = :category_id", { category_id });
      }
      
      if (type) {
        query = query.andWhere("item.type = :type", { type });
      }
      
      if (search) {
        query = query.andWhere(
          "(item.name ILIKE :search OR item.item_code ILIKE :search OR item.description ILIKE :search)",
          { search: `%${search}%` }
        );
      }
      
      // Apply sorting
      query = query.orderBy(`item.${sort_by}`, sort_order as "ASC" | "DESC");
      
      // Apply pagination
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).take(Number(limit));
      
      // Execute query
      const [items, count] = await query.getManyAndCount();
      
      // Return response
      return res.status(200).json({
        value: items,
        Count: count
      });
    } catch (error) {
      console.error("Error in getAll items:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Get item by ID
   * 
   * @param req Request object
   * @param res Response object
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const itemRepository = getRepository(Item);
      const item = await itemRepository.findOne({
        where: { id: Number(id) },
        relations: ["division", "category", "uom", "default_supplier"]
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      return res.status(200).json(item);
    } catch (error) {
      console.error("Error in getById item:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Create new item
   * 
   * @param req Request object
   * @param res Response object
   */
  async create(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const itemRepository = queryRunner.manager.getRepository(Item);
      
      // Validate required fields
      const {
        division_id,
        item_code,
        name,
        category_id,
        uom_id
      } = req.body;
      
      if (!division_id || !item_code || !name || !category_id || !uom_id) {
        return res.status(400).json({
          message: "Missing required fields: division_id, item_code, name, category_id, uom_id"
        });
      }
      
      // Check if item code already exists in the division
      const existingItem = await itemRepository.findOne({
        where: {
          division_id: Number(division_id),
          item_code: item_code
        }
      });
      
      if (existingItem) {
        return res.status(409).json({
          message: "Item code already exists in this division"
        });
      }
      
      // Create new item
      const newItem = itemRepository.create(req.body);
      const savedItem = await itemRepository.save(newItem);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(201).json(savedItem);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in create item:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Update existing item
   * 
   * @param req Request object
   * @param res Response object
   */
  async update(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const itemRepository = queryRunner.manager.getRepository(Item);
      
      // Check if item exists
      const item = await itemRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      // If item_code is being updated, check for duplicates
      if (req.body.item_code && req.body.item_code !== item.item_code) {
        const existingItem = await itemRepository.findOne({
          where: {
            division_id: req.body.division_id || item.division_id,
            item_code: req.body.item_code
          }
        });
        
        if (existingItem && existingItem.id !== Number(id)) {
          return res.status(409).json({
            message: "Item code already exists in this division"
          });
        }
      }
      
      // Update item
      const updatedItem = await itemRepository.save({
        ...item,
        ...req.body
      });
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json(updatedItem);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in update item:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Delete item
   * 
   * @param req Request object
   * @param res Response object
   */
  async delete(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const itemRepository = queryRunner.manager.getRepository(Item);
      
      // Check if item exists
      const item = await itemRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      // Instead of hard delete, set is_active to false
      item.is_active = false;
      await itemRepository.save(item);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "Item deactivated successfully"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in delete item:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Hard delete item (for admin use only)
   * 
   * @param req Request object
   * @param res Response object
   */
  async hardDelete(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const itemRepository = queryRunner.manager.getRepository(Item);
      
      // Check if item exists
      const item = await itemRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      // Perform hard delete
      await itemRepository.remove(item);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "Item permanently deleted"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in hardDelete item:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}
```

### Step 3: Create Item Routes

Create a file named `item.routes.ts` in your routes directory:

```typescript
import { Router } from "express";
import { ItemController } from "../controllers/item.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const itemController = new ItemController();

/**
 * Item Routes
 * 
 * API endpoints for Item management in the Zervi MRP system.
 * All routes are protected by authentication middleware.
 */

// Get all items with filtering, sorting, and pagination
router.get("/", authMiddleware, itemController.getAll);

// Get item by ID
router.get("/:id", authMiddleware, itemController.getById);

// Create new item
router.post("/", authMiddleware, itemController.create);

// Update existing item
router.put("/:id", authMiddleware, itemController.update);

// Soft delete item (deactivate)
router.delete("/:id", authMiddleware, itemController.delete);

// Hard delete item (admin only)
router.delete("/:id/hard", authMiddleware, itemController.hardDelete);

export default router;
```

### Step 4: Update API Routes

Update your main API routes file to include the Item routes:

```typescript
import { Router } from "express";
import itemRoutes from "./item.routes";
// Import other routes as needed

const router = Router();

/**
 * API Routes
 * 
 * Main router that includes all API endpoints for the Zervi MRP system.
 */

// Item Management routes
router.use("/items", itemRoutes);

// Add other routes here
// router.use("/companies", companyRoutes);
// router.use("/divisions", divisionRoutes);
// etc.

export default router;
```

### Step 5: Update Database Configuration

Ensure your TypeORM configuration includes the new entities:

```typescript
// In your database configuration file
import { ConnectionOptions } from "typeorm";
import { Company } from "./models/company.model";
import { Division } from "./models/division.model";
import { User } from "./models/user.model";
import { Role } from "./models/role.model";
import { Item } from "./models/item.model";
import { ItemCategory } from "./models/item-category.model";
import { UnitOfMeasurement } from "./models/unit-of-measurement.model";
import { Supplier } from "./models/supplier.model";

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "zervi_mrp",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [
    Company,
    Division,
    User,
    Role,
    Item,
    ItemCategory,
    UnitOfMeasurement,
    Supplier
  ],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscribers"
  }
};

export default config;
```

### Step 6: Generate and Run Migrations

Generate a migration for the new entities:

```bash
npx typeorm migration:generate -n AddItemManagement
```

Run the migration to update your database schema:

```bash
npx typeorm migration:run
```

### Step 7: Seed Initial Data (Optional)

Create a seed script for initial data like units of measurement:

```typescript
// src/seeds/uom.seed.ts
import { getRepository } from "typeorm";
import { UnitOfMeasurement } from "../models/unit-of-measurement.model";

export const seedUnitOfMeasurement = async () => {
  const uomRepository = getRepository(UnitOfMeasurement);
  
  // Check if data already exists
  const count = await uomRepository.count();
  if (count > 0) {
    console.log("Units of measurement already seeded");
    return;
  }
  
  // Seed data
  const uoms = [
    { name: "Piece", abbreviation: "pc" },
    { name: "Kilogram", abbreviation: "kg" },
    { name: "Meter", abbreviation: "m" },
    { name: "Liter", abbreviation: "L" },
    { name: "Square Meter", abbreviation: "m²" },
    { name: "Dozen", abbreviation: "dz" },
    { name: "Box", abbreviation: "box" },
    { name: "Roll", abbreviation: "roll" }
  ];
  
  await uomRepository.save(uoms);
  console.log("Units of measurement seeded successfully");
};
```

Run the seed script:

```typescript
// src/seeds/index.ts
import { createConnection } from "typeorm";
import { seedUnitOfMeasurement } from "./uom.seed";

const runSeeds = async () => {
  try {
    const connection = await createConnection();
    console.log("Database connected");
    
    await seedUnitOfMeasurement();
    
    await connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
};

runSeeds();
```

Execute the seed script:

```bash
ts-node src/seeds/index.ts
```

## Testing

### API Endpoint Testing

Use Postman or Insomnia to test the following endpoints:

#### 1. Get All Items
- **Method**: GET
- **URL**: `/api/items`
- **Query Parameters**:
  - division_id (optional)
  - category_id (optional)
  - type (optional)
  - search (optional)
  - page (optional, default: 1)
  - limit (optional, default: 10)
  - sort_by (optional, default: "id")
  - sort_order (optional, default: "ASC")
- **Headers**:
  - Authorization: Bearer {token}

#### 2. Get Item by ID
- **Method**: GET
- **URL**: `/api/items/:id`
- **Headers**:
  - Authorization: Bearer {token}

#### 3. Create Item
- **Method**: POST
- **URL**: `/api/items`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "division_id": 1,
  "item_code": "RM-001",
  "name": "Cotton Fabric",
  "description": "High-quality cotton fabric",
  "type": "raw_material",
  "category_id": 1,
  "uom_id": 2,
  "default_supplier_id": 1,
  "min_stock_level": 100,
  "reorder_point": 150,
  "lead_time_days": 7
}
```

#### 4. Update Item
- **Method**: PUT
- **URL**: `/api/items/:id`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "name": "Premium Cotton Fabric",
  "description": "High-quality premium cotton fabric",
  "min_stock_level": 150,
  "reorder_point": 200
}
```

#### 5. Delete Item (Soft Delete)
- **Method**: DELETE
- **URL**: `/api/items/:id`
- **Headers**:
  - Authorization: Bearer {token}

#### 6. Hard Delete Item (Admin Only)
- **Method**: DELETE
- **URL**: `/api/items/:id/hard`
- **Headers**:
  - Authorization: Bearer {token}

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Migration Errors
- **Issue**: Migration fails with foreign key constraint errors
- **Solution**: Ensure all referenced tables (divisions, item_categories, units_of_measurement, suppliers) exist before running migrations

#### 2. TypeORM Entity Relationship Errors
- **Issue**: Error with entity relationships
- **Solution**: Check that all referenced entities are properly imported and relationship decorators are correctly defined

#### 3. API Response Format Issues
- **Issue**: Frontend expects `{ value: Item[], Count: number }` but receives different format
- **Solution**: Ensure the controller's getAll method returns the correct format

#### 4. Authentication Middleware Errors
- **Issue**: API returns 401 Unauthorized
- **Solution**: Verify that the authMiddleware is correctly implemented and the token is valid

## Next Steps

After successfully implementing the Item Management component, you can proceed to:

1. **BOM Management Implementation**:
   - Create BOM and BOM Component models
   - Implement BOM controller with CRUD operations
   - Create BOM routes with authentication

2. **Manufacturing Order Implementation**:
   - Create Manufacturing Order and Operation models
   - Implement Manufacturing Order controller
   - Create Manufacturing Order routes

3. **Frontend Development**:
   - Begin frontend development after completing the core backend components
   - Create API client services for the implemented endpoints
   - Develop UI components for Item Management

4. **Testing and Integration**:
   - Test the complete workflow
   - Integrate frontend with backend
   - Perform end-to-end testing

## Frontend Development Timing

As per your question about when to start frontend development, the recommended approach is:

1. **Phase 1-3**: Focus on backend implementation (Items, BOM, Manufacturing Orders, Specialized Operations)
2. **Phase 4**: Begin frontend development after core backend components are implemented
3. **Parallel Development**: Once the basic backend structure is in place, you can start frontend development in parallel with remaining backend work

This approach ensures that:
- The API contract is stable before frontend development begins
- You can test API endpoints thoroughly before connecting the frontend
- The frontend can be developed with a clear understanding of the data structures and relationships

However, if you prefer, you could start developing simple frontend components (like Item Management UI) after completing the corresponding backend component, following an incremental approach.
