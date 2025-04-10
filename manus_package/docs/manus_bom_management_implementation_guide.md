# Zervi MRP Application - BOM Management Implementation Guide

<# Zervi MRP Application - BOM Management Implementation Guide

This document provides step-by-step instructions for implementing the Bill of Materials (BOM) Management component in your Zervi MRP Application using Windsurf framework with TypeORM and PostgreSQL.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Implementation Steps](#implementation-steps)
3. [Testing](#testing)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

## Prerequisites

Before beginning implementation, ensure you have:
- Completed the Item Management implementation
- Access to your Zervi MRP Application codebase
- Node.js and npm installed
- PostgreSQL database configured
- TypeORM installed and configured
- Basic understanding of Express.js and TypeORM

## Implementation Steps

### Step 1: Create Required Models

#### 1.1 Create BOM Model
Create a file named `bom.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Division } from "./division.model";
import { Item } from "./item.model";

/**
 * Bill of Materials (BOM) Entity
 * 
 * Represents a bill of materials in the Zervi MRP system.
 * A BOM defines the components required to produce a finished item.
 */
@Entity("boms")
export class BOM {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  bom_code: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 1 })
  quantity: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_default: boolean;

  @Column({ nullable: true })
  version: string;

  @Column({ type: "date", nullable: true })
  effective_date: Date;

  @Column({ type: "date", nullable: true })
  expiry_date: Date;

  @OneToMany(() => BOMComponent, component => component.bom)
  components: BOMComponent[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 1.2 Create BOM Component Model
Create a file named `bom-component.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { BOM } from "./bom.model";
import { Item } from "./item.model";

/**
 * BOM Component Entity
 * 
 * Represents components in a bill of materials in the Zervi MRP system.
 * Each component is an item with a specific quantity required for the BOM.
 */
@Entity("bom_components")
export class BOMComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BOM, bom => bom.components)
  @JoinColumn({ name: "bom_id" })
  bom: BOM;

  @Column()
  bom_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity: number;

  @Column({ nullable: true })
  position: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ default: false })
  is_optional: boolean;

  @Column({ default: 0 })
  waste_percentage: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### Step 2: Create BOM Controller

Create a file named `bom.controller.ts` in your controllers directory:

```typescript
import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { BOM } from "../models/bom.model";
import { BOMComponent } from "../models/bom-component.model";
import { Item } from "../models/item.model";

/**
 * BOM Controller
 * 
 * Handles CRUD operations for Bill of Materials (BOM) entities in the Zervi MRP system.
 */
export class BOMController {
  /**
   * Get all BOMs with optional filtering
   * 
   * @param req Request object
   * @param res Response object
   */
  async getAll(req: Request, res: Response) {
    try {
      const bomRepository = getRepository(BOM);
      
      // Extract query parameters
      const { 
        division_id, 
        item_id, 
        is_active,
        is_default,
        search,
        page = 1,
        limit = 10,
        sort_by = "id",
        sort_order = "ASC"
      } = req.query;
      
      // Build query
      let query = bomRepository.createQueryBuilder("bom")
        .leftJoinAndSelect("bom.division", "division")
        .leftJoinAndSelect("bom.item", "item");
      
      // Apply filters
      if (division_id) {
        query = query.andWhere("bom.division_id = :division_id", { division_id });
      }
      
      if (item_id) {
        query = query.andWhere("bom.item_id = :item_id", { item_id });
      }
      
      if (is_active !== undefined) {
        query = query.andWhere("bom.is_active = :is_active", { is_active: is_active === 'true' });
      }
      
      if (is_default !== undefined) {
        query = query.andWhere("bom.is_default = :is_default", { is_default: is_default === 'true' });
      }
      
      if (search) {
        query = query.andWhere(
          "(bom.name ILIKE :search OR bom.bom_code ILIKE :search OR bom.description ILIKE :search)",
          { search: `%${search}%` }
        );
      }
      
      // Apply sorting
      query = query.orderBy(`bom.${sort_by}`, sort_order as "ASC" | "DESC");
      
      // Apply pagination
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).take(Number(limit));
      
      // Execute query
      const [boms, count] = await query.getManyAndCount();
      
      // Return response
      return res.status(200).json({
        value: boms,
        Count: count
      });
    } catch (error) {
      console.error("Error in getAll BOMs:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Get BOM by ID with components
   * 
   * @param req Request object
   * @param res Response object
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const bomRepository = getRepository(BOM);
      const bom = await bomRepository.findOne({
        where: { id: Number(id) },
        relations: ["division", "item", "components", "components.item"]
      });
      
      if (!bom) {
        return res.status(404).json({
          message: "BOM not found"
        });
      }
      
      return res.status(200).json(bom);
    } catch (error) {
      console.error("Error in getById BOM:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Create new BOM with components
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
      const bomRepository = queryRunner.manager.getRepository(BOM);
      const bomComponentRepository = queryRunner.manager.getRepository(BOMComponent);
      const itemRepository = queryRunner.manager.getRepository(Item);
      
      // Extract BOM data and components from request
      const { components, ...bomData } = req.body;
      
      // Validate required fields
      const {
        division_id,
        bom_code,
        name,
        item_id
      } = bomData;
      
      if (!division_id || !bom_code || !name || !item_id) {
        return res.status(400).json({
          message: "Missing required fields: division_id, bom_code, name, item_id"
        });
      }
      
      // Check if BOM code already exists in the division
      const existingBOM = await bomRepository.findOne({
        where: {
          division_id: Number(division_id),
          bom_code: bom_code
        }
      });
      
      if (existingBOM) {
        return res.status(409).json({
          message: "BOM code already exists in this division"
        });
      }
      
      // Check if item exists
      const item = await itemRepository.findOne({
        where: { id: Number(item_id) }
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      // Create new BOM
      const newBOM = bomRepository.create(bomData);
      const savedBOM = await bomRepository.save(newBOM);
      
      // Create BOM components if provided
      if (components && Array.isArray(components) && components.length > 0) {
        // Validate components
        for (const component of components) {
          if (!component.item_id || !component.quantity) {
            return res.status(400).json({
              message: "Each component must have item_id and quantity"
            });
          }
          
          // Check if component item exists
          const componentItem = await itemRepository.findOne({
            where: { id: Number(component.item_id) }
          });
          
          if (!componentItem) {
            return res.status(404).json({
              message: `Component item with ID ${component.item_id} not found`
            });
          }
        }
        
        // Create components
        const bomComponents = components.map((component, index) => {
          return bomComponentRepository.create({
            ...component,
            bom_id: savedBOM.id,
            position: component.position || index + 1
          });
        });
        
        await bomComponentRepository.save(bomComponents);
        
        // Reload BOM with components
        const bomWithComponents = await bomRepository.findOne({
          where: { id: savedBOM.id },
          relations: ["division", "item", "components", "components.item"]
        });
        
        // Commit transaction
        await queryRunner.commitTransaction();
        
        return res.status(201).json(bomWithComponents);
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(201).json(savedBOM);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in create BOM:", error);
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
   * Update existing BOM
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
      const bomRepository = queryRunner.manager.getRepository(BOM);
      
      // Extract BOM data and components from request
      const { components, ...bomData } = req.body;
      
      // Check if BOM exists
      const bom = await bomRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!bom) {
        return res.status(404).json({
          message: "BOM not found"
        });
      }
      
      // If bom_code is being updated, check for duplicates
      if (bomData.bom_code && bomData.bom_code !== bom.bom_code) {
        const existingBOM = await bomRepository.findOne({
          where: {
            division_id: bomData.division_id || bom.division_id,
            bom_code: bomData.bom_code
          }
        });
        
        if (existingBOM && existingBOM.id !== Number(id)) {
          return res.status(409).json({
            message: "BOM code already exists in this division"
          });
        }
      }
      
      // Update BOM
      const updatedBOM = await bomRepository.save({
        ...bom,
        ...bomData
      });
      
      // If components are provided, handle them separately
      if (components !== undefined) {
        // Components will be handled by a separate endpoint
        // This keeps the update endpoint focused on BOM properties
        return res.status(200).json({
          ...updatedBOM,
          message: "BOM updated successfully. Use the components endpoint to update components."
        });
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json(updatedBOM);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in update BOM:", error);
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
   * Delete BOM
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
      const bomRepository = queryRunner.manager.getRepository(BOM);
      
      // Check if BOM exists
      const bom = await bomRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!bom) {
        return res.status(404).json({
          message: "BOM not found"
        });
      }
      
      // Instead of hard delete, set is_active to false
      bom.is_active = false;
      await bomRepository.save(bom);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "BOM deactivated successfully"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in delete BOM:", error);
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
   * Hard delete BOM (for admin use only)
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
      const bomRepository = queryRunner.manager.getRepository(BOM);
      const bomComponentRepository = queryRunner.manager.getRepository(BOMComponent);
      
      // Check if BOM exists
      const bom = await bomRepository.findOne({
        where: { id: Number(id) },
        relations: ["components"]
      });
      
      if (!bom) {
        return res.status(404).json({
          message: "BOM not found"
        });
      }
      
      // Delete BOM components first
      if (bom.components && bom.components.length > 0) {
        await bomComponentRepository.remove(bom.components);
      }
      
      // Perform hard delete of BOM
      await bomRepository.remove(bom);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "BOM and its components permanently deleted"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in hardDelete BOM:", error);
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
   * Get BOM components
   * 
   * @param req Request object
   * @param res Response object
   */
  async getComponents(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const bomComponentRepository = getRepository(BOMComponent);
      const components = await bomComponentRepository.find({
        where: { bom_id: Number(id) },
        relations: ["item"],
        order: { position: "ASC" }
      });
      
      return res.status(200).json({
        value: components,
        Count: components.length
      });
    } catch (error) {
      console.error("Error in getComponents:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Add component to BOM
   * 
   * @param req Request object
   * @param res Response object
   */
  async addComponent(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const bomRepository = queryRunner.manager.getRepository(BOM);
      const bomComponentRepository = queryRunner.manager.getRepository(BOMComponent);
      const itemRepository = queryRunner.manager.getRepository(Item);
      
      // Check if BOM exists
      const bom = await bomRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!bom) {
        return res.status(404).json({
          message: "BOM not found"
        });
      }
      
      // Validate component data
      const { item_id, quantity } = req.body;
      
      if (!item_id || !quantity) {
        return res.status(400).json({
          message: "Missing required fields: item_id, quantity"
        });
      }
      
      // Check if item exists
      const item = await itemRepository.findOne({
        where: { id: Number(item_id) }
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      // Check if component already exists
      const existingComponent = await bomComponentRepository.findOne({
        where: {
          bom_id: Number(id),
          item_id: Number(item_id)
        }
      });
      
      if (existingComponent) {
        return res.status(409).json({
          message: "Component with this item already exists in this BOM"
        });
      }
      
      // Get highest position
      const maxPositionResult = await bomComponentRepository
        .createQueryBuilder("component")
        .select("MAX(component.position)", "maxPosition")
        .where("component.bom_id = :bomId", { bomId: Number(id) })
        .getRawOne();
      
      const nextPosition = maxPositionResult.maxPosition ? maxPositionResult.maxPosition + 1 : 1;
      
      // Create new component
      const newComponent = bomComponentRepository.create({
        ...req.body,
        bom_id: Number(id),
        position: req.body.position || nextPosition
      });
      
      const savedComponent = await bomComponentRepository.save(newComponent);
      
      // Load item relation
      const componentWithItem = await bomComponentRepository.findOne({
        where: { id: savedComponent.id },
        relations: ["item"]
      });
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(201).json(componentWithItem);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in addComponent:", error);
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
   * Update BOM component
   * 
   * @param req Request object
   * @param res Response object
   */
  async updateComponent(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id, componentId } = req.params;
      const bomComponentRepository = queryRunner.manager.getRepository(BOMComponent);
      
      // Check if component exists and belongs to the BOM
      const component = await bomComponentRepository.findOne({
        where: {
          id: Number(componentId),
          bom_id: Number(id)
        }
      });
      
      if (!component) {
        return res.status(404).json({
          message: "Component not found or does not belong to this BOM"
        });
      }
      
      // Update component
      const updatedComponent = await bomComponentRepository.save({
        ...component,
        ...req.body
      });
      
      // Load item relation
      const componentWithItem = await bomComponentRepository.findOne({
        where: { id: updatedComponent.id },
        relations: ["item"]
      });
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json(componentWithItem);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in updateComponent:", error);
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
   * Remove component from BOM
   * 
   * @param req Request object
   * @param res Response object
   */
  async removeComponent(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id, componentId } = req.params;
      const bomComponentRepository = queryRunner.manager.getRepository(BOMComponent);
      
      // Check if component exists and belongs to the BOM
      const component = await bomComponentRepository.findOne({
        where: {
          id: Number(componentId),
          bom_id: Number(id)
        }
      });
      
      if (!component) {
        return res.status(404).json({
          message: "Component not found or does not belong to this BOM"
        });
      }
      
      // Remove component
      await bomComponentRepository.remove(component);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "Component removed successfully"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in removeComponent:", error);
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
   * Set BOM as default for an item
   * 
   * @param req Request object
   * @param res Response object
   */
  async setDefault(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const bomRepository = queryRunner.manager.getRepository(BOM);
      
      // Check if BOM exists
      const bom = await bomRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!bom) {
        return res.status(404).json({
          message: "BOM not found"
        });
      }
      
      // Reset default flag for all BOMs of this item
      await bomRepository
        .createQueryBuilder()
        .update(BOM)
        .set({ is_default: false })
        .where("item_id = :itemId", { itemId: bom.item_id })
        .execute();
      
      // Set this BOM as default
      bom.is_default = true;
      await bomRepository.save(bom);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "BOM set as default for this item",
        bom
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in setDefault:", error);
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

### Step 3: Create BOM Routes

Create a file named `bom.routes.ts` in your routes directory:

```typescript
import { Router } from "express";
import { BOMController } from "../controllers/bom.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const bomController = new BOMController();

/**
 * BOM Routes
 * 
 * API endpoints for Bill of Materials (BOM) management in the Zervi MRP system.
 * All routes are protected by authentication middleware.
 */

// Get all BOMs with filtering, sorting, and pagination
router.get("/", authMiddleware, bomController.getAll);

// Get BOM by ID with components
router.get("/:id", authMiddleware, bomController.getById);

// Create new BOM with components
router.post("/", authMiddleware, bomController.create);

// Update existing BOM
router.put("/:id", authMiddleware, bomController.update);

// Soft delete BOM (deactivate)
router.delete("/:id", authMiddleware, bomController.delete);

// Hard delete BOM (admin only)
router.delete("/:id/hard", authMiddleware, bomController.hardDelete);

// Get BOM components
router.get("/:id/components", authMiddleware, bomController.getComponents);

// Add component to BOM
router.post("/:id/components", authMiddleware, bomController.addComponent);

// Update BOM component
router.put("/:id/components/:componentId", authMiddleware, bomController.updateComponent);

// Remove component from BOM
router.delete("/:id/components/:componentId", authMiddleware, bomController.removeComponent);

// Set BOM as default for an item
router.post("/:id/set-default", authMiddleware, bomController.setDefault);

export default router;
```

### Step 4: Update API Routes

Update your main API routes file to include the BOM routes:

```typescript
import { Router } from "express";
import itemRoutes from "./item.routes";
import bomRoutes from "./bom.routes";
// Import other routes as needed

const router = Router();

/**
 * API Routes
 * 
 * Main router that includes all API endpoints for the Zervi MRP system.
 */

// Item Management routes
router.use("/items", itemRoutes);

// BOM Management routes
router.use("/boms", bomRoutes);

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
import { BOM } from "./models/bom.model";
import { BOMComponent } from "./models/bom-component.model";

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
    Supplier,
    BOM,
    BOMComponent
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
npx typeorm migration:generate -n AddBOMManagement
```

Run the migration to update your database schema:

```bash
npx typeorm migration:run
```

## Testing

### API Endpoint Testing

Use Postman or Insomnia to test the following endpoints:

#### 1. Get All BOMs
- **Method**: GET
- **URL**: `/api/boms`
- **Query Parameters**:
  - division_id (optional)
  - item_id (optional)
  - is_active (optional)
  - is_default (optional)
  - search (optional)
  - page (optional, default: 1)
  - limit (optional, default: 10)
  - sort_by (optional, default: "id")
  - sort_order (optional, default: "ASC")
- **Headers**:
  - Authorization: Bearer {token}

#### 2. Get BOM by ID
- **Method**: GET
- **URL**: `/api/boms/:id`
- **Headers**:
  - Authorization: Bearer {token}

#### 3. Create BOM
- **Method**: POST
- **URL**: `/api/boms`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "division_id": 1,
  "bom_code": "BOM-001",
  "name": "Standard T-Shirt BOM",
  "description": "Bill of materials for standard t-shirt production",
  "item_id": 1,
  "quantity": 1,
  "version": "1.0",
  "effective_date": "2025-01-01",
  "components": [
    {
      "item_id": 2,
      "quantity": 0.5,
      "notes": "Cotton fabric",
      "waste_percentage": 5
    },
    {
      "item_id": 3,
      "quantity": 1,
      "notes": "Thread",
      "waste_percentage": 2
    },
    {
      "item_id": 4,
      "quantity": 1,
      "notes": "Label",
      "is_optional": true
    }
  ]
}
```

#### 4. Update BOM
- **Method**: PUT
- **URL**: `/api/boms/:id`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "name": "Premium T-Shirt BOM",
  "description": "Bill of materials for premium t-shirt production",
  "version": "1.1"
}
```

#### 5. Delete BOM (Soft Delete)
- **Method**: DELETE
- **URL**: `/api/boms/:id`
- **Headers**:
  - Authorization: Bearer {token}

#### 6. Hard Delete BOM (Admin Only)
- **Method**: DELETE
- **URL**: `/api/boms/:id/hard`
- **Headers**:
  - Authorization: Bearer {token}

#### 7. Get BOM Components
- **Method**: GET
- **URL**: `/api/boms/:id/components`
- **Headers**:
  - Authorization: Bearer {token}

#### 8. Add Component to BOM
- **Method**: POST
- **URL**: `/api/boms/:id/components`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "item_id": 5,
  "quantity": 2,
  "notes": "Buttons",
  "waste_percentage": 1
}
```

#### 9. Update BOM Component
- **Method**: PUT
- **URL**: `/api/boms/:id/components/:componentId`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "quantity": 3,
  "notes": "Premium buttons",
  "waste_percentage": 2
}
```

#### 10. Remove Component from BOM
- **Method**: DELETE
- **URL**: `/api/boms/:id/components/:componentId`
- **Headers**:
  - Authorization: Bearer {token}

#### 11. Set BOM as Default
- **Method**: POST
- **URL**: `/api/boms/:id/set-default`
- **Headers**:
  - Authorization: Bearer {token}

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Migration Errors
- **Issue**: Migration fails with foreign key constraint errors
- **Solution**: Ensure all referenced tables (items, divisions) exist before running migrations

#### 2. TypeORM Entity Relationship Errors
- **Issue**: Error with entity relationships
- **Solution**: Check that all referenced entities are properly imported and relationship decorators are correctly defined

#### 3. Circular Dependencies
- **Issue**: Circular dependency between BOM and BOMComponent
- **Solution**: Ensure proper import structure and use forward references if needed

#### 4. Transaction Management Issues
- **Issue**: Transaction rollback not working properly
- **Solution**: Ensure all database operations within a transaction are using the queryRunner.manager

#### 5. Component Management Errors
- **Issue**: Components not being saved with BOM
- **Solution**: Verify the transaction flow in the create method and ensure proper error handling

## Next Steps

After successfully implementing the BOM Management component, you can proceed to:

1. **Manufacturing Order Implementation**:
   - Create Manufacturing Order and Operation models
   - Implement Manufacturing Order controller
   - Create Manufacturing Order routes

2. **Specialized Operations Implementation**:
   - Create models for textile operations (laminating, cutting, sewing)
   - Implement controllers for operation management
   - Create routes for specialized operations

3. **Inter-Division Transfers Implementation**:
   - Create models for transfers between divisions
   - Implement transfer controllers and routes

4. **Frontend Development**:
   - Begin frontend development for BOM Management
   - Create UI components for BOM creation and editing
   - Implement component management interface

## Multi-Level BOM Structure

One of the key features of the BOM Management system is the ability to handle multi-level BOM structures. This allows for complex manufacturing processes where components themselves can be manufactured items with their own BOMs.

### Implementing Multi-Level BOM Explosion

To implement multi-level BOM explosion (calculating all raw materials needed for a finished product), you can add a method to your BOM controller:

```typescript
/**
 * Explode BOM to get all raw materials needed
 * 
 * @param req Request object
 * @param res Response object
 */
async explodeBOM(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.query;
    
    const bomRepository = getRepository(BOM);
    const bomComponentRepository = getRepository(BOMComponent);
    const itemRepository = getRepository(Item);
    
    // Check if BOM exists
    const bom = await bomRepository.findOne({
      where: { id: Number(id) },
      relations: ["item"]
    });
    
    if (!bom) {
      return res.status(404).json({
        message: "BOM not found"
      });
    }
    
    // Function to recursively explode BOM
    const explodeBOMRecursive = async (bomId, parentQuantity, level = 0, path = []) => {
      // Check for circular references
      if (path.includes(bomId)) {
        throw new Error(`Circular reference detected in BOM structure: ${path.join(' -> ')} -> ${bomId}`);
      }
      
      // Get components
      const components = await bomComponentRepository.find({
        where: { bom_id: bomId },
        relations: ["item"]
      });
      
      let result = [];
      
      // Process each component
      for (const component of components) {
        const componentQuantity = Number(component.quantity) * Number(parentQuantity);
        
        // Add component to result
        result.push({
          item_id: component.item_id,
          item_code: component.item.item_code,
          name: component.item.name,
          type: component.item.type,
          quantity: componentQuantity,
          level,
          waste_percentage: component.waste_percentage,
          gross_quantity: componentQuantity * (1 + (component.waste_percentage / 100))
        });
        
        // If component is a manufactured item, check if it has a BOM
        if (component.item.type === 'finished_product' || component.item.type === 'semi_finished') {
          // Find default BOM for this item
          const itemBOM = await bomRepository.findOne({
            where: {
              item_id: component.item_id,
              is_default: true,
              is_active: true
            }
          });
          
          if (itemBOM) {
            // Recursively explode this BOM
            const subComponents = await explodeBOMRecursive(
              itemBOM.id,
              componentQuantity,
              level + 1,
              [...path, bomId]
            );
            
            // Add sub-components to result
            result = result.concat(subComponents);
          }
        }
      }
      
      return result;
    };
    
    // Start explosion process
    const explodedComponents = await explodeBOMRecursive(Number(id), Number(quantity), 0, []);
    
    // Group by item_id and sum quantities
    const groupedComponents = {};
    explodedComponents.forEach(component => {
      if (!groupedComponents[component.item_id]) {
        groupedComponents[component.item_id] = { ...component, total_quantity: 0, total_gross_quantity: 0 };
      }
      groupedComponents[component.item_id].total_quantity += component.quantity;
      groupedComponents[component.item_id].total_gross_quantity += component.gross_quantity;
    });
    
    return res.status(200).json({
      bom: {
        id: bom.id,
        code: bom.bom_code,
        name: bom.name,
        item: bom.item
      },
      quantity: Number(quantity),
      detailed_components: explodedComponents,
      grouped_components: Object.values(groupedComponents)
    });
  } catch (error) {
    console.error("Error in explodeBOM:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}
```

Add this route to your BOM routes:

```typescript
// Explode BOM to get all raw materials needed
router.get("/:id/explode", authMiddleware, bomController.explodeBOM);
```

This implementation allows you to calculate all raw materials needed for a finished product, taking into account multi-level BOM structures and waste percentages.
