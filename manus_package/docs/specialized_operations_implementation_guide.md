# Zervi MRP Application - Specialized Operations Implementation Guide

This document provides step-by-step instructions for implementing the Specialized Operations component in your Zervi MRP Application using Windsurf framework with TypeORM and PostgreSQL.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Implementation Steps](#implementation-steps)
3. [Testing](#testing)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

## Prerequisites

Before beginning implementation, ensure you have:
- Completed the Item Management, BOM Management, and Manufacturing Order implementations
- Access to your Zervi MRP Application codebase
- Node.js and npm installed
- PostgreSQL database configured
- TypeORM installed and configured
- Basic understanding of Express.js and TypeORM

## Implementation Steps

### Step 1: Create Required Models

#### 1.1 Create Specialized Operation Model
Create a file named `specialized-operation.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ManufacturingOrderOperation } from "./manufacturing-order-operation.model";
import { User } from "./user.model";

/**
 * Specialized Operation Entity
 * 
 * Represents specialized manufacturing operations in the Zervi MRP system.
 * These operations extend the basic manufacturing operations with industry-specific parameters.
 */
@Entity("specialized_operations")
export class SpecializedOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ManufacturingOrderOperation)
  @JoinColumn({ name: "operation_id" })
  operation: ManufacturingOrderOperation;

  @Column()
  operation_id: number;

  @Column({
    type: "enum",
    enum: ["cutting", "sewing", "laminating", "quality_check", "packaging", "other"],
    default: "other"
  })
  operation_type: string;

  @Column({ type: "jsonb", nullable: true })
  parameters: any;

  @Column({ type: "jsonb", nullable: true })
  equipment_settings: any;

  @Column({ nullable: true })
  equipment_id: string;

  @Column({ nullable: true })
  workstation_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "performed_by" })
  performedBy: User;

  @Column({ nullable: true })
  performed_by: number;

  @Column({ type: "timestamp", nullable: true })
  start_time: Date;

  @Column({ type: "timestamp", nullable: true })
  end_time: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  duration_minutes: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  quantity_processed: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  quantity_rejected: number;

  @Column({ type: "text", nullable: true })
  rejection_reason: string;

  @Column({ type: "jsonb", nullable: true })
  quality_metrics: any;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ default: false })
  is_completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Helper methods to handle specialized operation types
  static getCuttingDefaults() {
    return {
      parameters: {
        material_type: "",
        pattern_id: "",
        cut_width_mm: 0,
        cut_length_mm: 0,
        layers: 1,
        blade_type: "standard",
        cutting_speed: "medium"
      },
      equipment_settings: {
        blade_pressure: 0,
        blade_angle: 0,
        feed_rate: 0
      }
    };
  }

  static getSewingDefaults() {
    return {
      parameters: {
        stitch_type: "straight",
        stitch_length_mm: 2.5,
        thread_type: "",
        needle_size: "",
        seam_type: "standard"
      },
      equipment_settings: {
        tension: 5,
        speed: "medium",
        presser_foot_pressure: "medium"
      }
    };
  }

  static getLaminatingDefaults() {
    return {
      parameters: {
        adhesive_type: "",
        temperature_celsius: 0,
        pressure_bar: 0,
        dwell_time_seconds: 0,
        material_layers: []
      },
      equipment_settings: {
        heat_zone_1: 0,
        heat_zone_2: 0,
        heat_zone_3: 0,
        roller_pressure: 0,
        speed_m_min: 0
      }
    };
  }

  static getQualityCheckDefaults() {
    return {
      parameters: {
        inspection_points: [],
        acceptance_criteria: {},
        sampling_rate: "100%"
      },
      quality_metrics: {
        visual_inspection: "pass",
        measurements: {},
        defects_found: 0,
        overall_rating: "acceptable"
      }
    };
  }
}
```

#### 1.2 Create Operation Result Model
Create a file named `operation-result.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SpecializedOperation } from "./specialized-operation.model";

/**
 * Operation Result Entity
 * 
 * Represents results and measurements from specialized operations in the Zervi MRP system.
 * Stores detailed metrics, test results, and quality data for manufacturing operations.
 */
@Entity("operation_results")
export class OperationResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SpecializedOperation)
  @JoinColumn({ name: "specialized_operation_id" })
  specializedOperation: SpecializedOperation;

  @Column()
  specialized_operation_id: number;

  @Column({ type: "jsonb", nullable: true })
  measurements: any;

  @Column({ type: "jsonb", nullable: true })
  test_results: any;

  @Column({
    type: "enum",
    enum: ["pass", "fail", "conditional_pass", "needs_review"],
    default: "needs_review"
  })
  result_status: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  defect_rate: number;

  @Column({ type: "text", nullable: true })
  inspector_notes: string;

  @Column({ type: "jsonb", nullable: true })
  images: any;

  @Column({ type: "jsonb", nullable: true })
  attachments: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 1.3 Create Material Consumption Model
Create a file named `material-consumption.model.ts` in your models directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SpecializedOperation } from "./specialized-operation.model";
import { Item } from "./item.model";

/**
 * Material Consumption Entity
 * 
 * Represents material consumption during specialized operations in the Zervi MRP system.
 * Tracks actual material usage, waste, and efficiency metrics.
 */
@Entity("material_consumptions")
export class MaterialConsumption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SpecializedOperation)
  @JoinColumn({ name: "specialized_operation_id" })
  specializedOperation: SpecializedOperation;

  @Column()
  specialized_operation_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  planned_quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  actual_quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  waste_quantity: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  efficiency_percentage: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "timestamp", nullable: true })
  consumption_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### Step 2: Create Specialized Operation Controller

Create a file named `specialized-operation.controller.ts` in your controllers directory. This is a comprehensive controller with many methods, so I'll show the structure and key methods:

```typescript
import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { SpecializedOperation } from "../models/specialized-operation.model";
import { OperationResult } from "../models/operation-result.model";
import { MaterialConsumption } from "../models/material-consumption.model";
import { ManufacturingOrderOperation } from "../models/manufacturing-order-operation.model";
import { Item } from "../models/item.model";

/**
 * Specialized Operation Controller
 * 
 * Handles CRUD operations for Specialized Operation entities in the Zervi MRP system.
 */
export class SpecializedOperationController {
  /**
   * Get all specialized operations with optional filtering
   */
  async getAll(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Get specialized operations by type
   */
  async getByType(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Get specialized operations by manufacturing order
   */
  async getByManufacturingOrder(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Get specialized operation by ID with results and material consumption
   */
  async getById(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Create new specialized operation
   */
  async create(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Update existing specialized operation
   */
  async update(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Delete specialized operation
   */
  async delete(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Add operation result
   */
  async addResult(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Update operation result
   */
  async updateResult(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Delete operation result
   */
  async deleteResult(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Add material consumption
   */
  async addMaterialConsumption(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Update material consumption
   */
  async updateMaterialConsumption(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Delete material consumption
   */
  async deleteMaterialConsumption(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Get operations by type
   */
  async getByType(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Get operations by manufacturing order
   */
  async getByManufacturingOrder(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Complete specialized operation
   */
  async complete(req: Request, res: Response) {
    // Implementation details...
  }
  
  /**
   * Get operation efficiency metrics
   */
  async getEfficiencyMetrics(req: Request, res: Response) {
    // Implementation details...
  }
}
```

For the full implementation of each method, please refer to the complete controller file provided separately.

### Step 3: Create Specialized Operation Routes

Create a file named `specialized-operation.routes.ts` in your routes directory:

```typescript
import { Router } from "express";
import { SpecializedOperationController } from "../controllers/specialized-operation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const specializedOperationController = new SpecializedOperationController();

/**
 * Specialized Operation Routes
 * 
 * API endpoints for Specialized Operation management in the Zervi MRP system.
 * All routes are protected by authentication middleware.
 */

// Get all specialized operations with filtering, sorting, and pagination
router.get("/", authMiddleware, specializedOperationController.getAll);

// Get specialized operations by type
router.get("/type/:type", authMiddleware, specializedOperationController.getByType);

// Get specialized operations by manufacturing order
router.get("/manufacturing-order/:orderId", authMiddleware, specializedOperationController.getByManufacturingOrder);

// Get specialized operation by ID with results and material consumption
router.get("/:id", authMiddleware, specializedOperationController.getById);

// Create new specialized operation
router.post("/", authMiddleware, specializedOperationController.create);

// Update existing specialized operation
router.put("/:id", authMiddleware, specializedOperationController.update);

// Delete specialized operation
router.delete("/:id", authMiddleware, specializedOperationController.delete);

// Complete specialized operation
router.post("/:id/complete", authMiddleware, specializedOperationController.complete);

// Get operation efficiency metrics
router.get("/:id/efficiency", authMiddleware, specializedOperationController.getEfficiencyMetrics);

// Add operation result
router.post("/:id/results", authMiddleware, specializedOperationController.addResult);

// Update operation result
router.put("/:id/results/:resultId", authMiddleware, specializedOperationController.updateResult);

// Delete operation result
router.delete("/:id/results/:resultId", authMiddleware, specializedOperationController.deleteResult);

// Add material consumption
router.post("/:id/material-consumption", authMiddleware, specializedOperationController.addMaterialConsumption);

// Update material consumption
router.put("/:id/material-consumption/:consumptionId", authMiddleware, specializedOperationController.updateMaterialConsumption);

// Delete material consumption
router.delete("/:id/material-consumption/:consumptionId", authMiddleware, specializedOperationController.deleteMaterialConsumption);

export default router;
```

### Step 4: Update API Routes

Update your main API routes file to include the Specialized Operation routes:

```typescript
import { Router } from "express";
import itemRoutes from "./item.routes";
import bomRoutes from "./bom.routes";
import manufacturingOrderRoutes from "./manufacturing-order.routes";
import specializedOperationRoutes from "./specialized-operation.routes";
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

// Manufacturing Order routes
router.use("/manufacturing-orders", manufacturingOrderRoutes);

// Specialized Operation routes
router.use("/specialized-operations", specializedOperationRoutes);

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
import { ManufacturingOrder } from "./models/manufacturing-order.model";
import { ManufacturingOrderOperation } from "./models/manufacturing-order-operation.model";
import { SpecializedOperation } from "./models/specialized-operation.model";
import { OperationResult } from "./models/operation-result.model";
import { MaterialConsumption } from "./models/material-consumption.model";

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
    BOMComponent,
    ManufacturingOrder,
    ManufacturingOrderOperation,
    SpecializedOperation,
    OperationResult,
    MaterialConsumption
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
npx typeorm migration:generate -n AddSpecializedOperations
```

Run the migration to update your database schema:

```bash
npx typeorm migration:run
```

## Testing

### API Endpoint Testing

Use Postman or Insomnia to test the following endpoints:

#### 1. Get All Specialized Operations
- **Method**: GET
- **URL**: `/api/specialized-operations`
- **Query Parameters**:
  - operation_id (optional)
  - operation_type (optional)
  - performed_by (optional)
  - is_completed (optional)
  - start_date (optional)
  - end_date (optional)
  - page (optional, default: 1)
  - limit (optional, default: 10)
  - sort_by (optional, default: "id")
  - sort_order (optional, default: "ASC")
- **Headers**:
  - Authorization: Bearer {token}

#### 2. Get Specialized Operations by Type
- **Method**: GET
- **URL**: `/api/specialized-operations/type/{type}`
- **Headers**:
  - Authorization: Bearer {token}

#### 3. Get Specialized Operations by Manufacturing Order
- **Method**: GET
- **URL**: `/api/specialized-operations/manufacturing-order/{orderId}`
- **Headers**:
  - Authorization: Bearer {token}

#### 4. Get Specialized Operation by ID
- **Method**: GET
- **URL**: `/api/specialized-operations/{id}`
- **Headers**:
  - Authorization: Bearer {token}

#### 5. Create Specialized Operation
- **Method**: POST
- **URL**: `/api/specialized-operations`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "operation_id": 1,
  "operation_type": "cutting",
  "parameters": {
    "material_type": "Cotton",
    "pattern_id": "P-1001",
    "cut_width_mm": 1200,
    "cut_length_mm": 800,
    "layers": 5
  },
  "equipment_settings": {
    "blade_pressure": 75,
    "blade_angle": 45,
    "feed_rate": 120
  },
  "equipment_id": "CUT-001",
  "workstation_id": "WS-101",
  "performed_by": 1,
  "start_time": "2025-04-01T09:00:00Z",
  "quantity_processed": 100,
  "notes": "Initial cutting operation"
}
```

#### 6. Update Specialized Operation
- **Method**: PUT
- **URL**: `/api/specialized-operations/{id}`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "parameters": {
    "layers": 6
  },
  "equipment_settings": {
    "blade_pressure": 80
  },
  "quantity_processed": 120,
  "notes": "Updated cutting operation"
}
```

#### 7. Complete Specialized Operation
- **Method**: POST
- **URL**: `/api/specialized-operations/{id}/complete`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "quantity_processed": 120,
  "quantity_rejected": 5,
  "rejection_reason": "Material defects",
  "quality_metrics": {
    "visual_inspection": "pass",
    "measurements": {
      "width_deviation_mm": 2,
      "length_deviation_mm": 1
    }
  }
}
```

#### 8. Get Operation Efficiency Metrics
- **Method**: GET
- **URL**: `/api/specialized-operations/{id}/efficiency`
- **Headers**:
  - Authorization: Bearer {token}

#### 9. Add Operation Result
- **Method**: POST
- **URL**: `/api/specialized-operations/{id}/results`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "measurements": {
    "width_mm": 1198,
    "length_mm": 799,
    "thickness_mm": 2.5
  },
  "test_results": {
    "visual_inspection": "pass",
    "dimensional_accuracy": "pass"
  },
  "result_status": "pass",
  "defect_rate": 2.5,
  "inspector_notes": "Minor dimensional variations within tolerance"
}
```

#### 10. Add Material Consumption
- **Method**: POST
- **URL**: `/api/specialized-operations/{id}/material-consumption`
- **Headers**:
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
```json
{
  "item_id": 1,
  "planned_quantity": 10,
  "actual_quantity": 10.5,
  "waste_quantity": 0.5,
  "notes": "Standard material consumption"
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Migration Errors
- **Issue**: Migration fails with foreign key constraint errors
- **Solution**: Ensure all referenced tables (manufacturing_order_operations, users, items) exist before running migrations

#### 2. TypeORM Entity Relationship Errors
- **Issue**: Error with entity relationships
- **Solution**: Check that all referenced entities are properly imported and relationship decorators are correctly defined

#### 3. JSONB Column Errors
- **Issue**: Error with JSONB columns
- **Solution**: Ensure your PostgreSQL version supports JSONB and that you're passing valid JSON objects

#### 4. Operation Type Validation Errors
- **Issue**: Invalid operation type error
- **Solution**: Ensure operation_type is one of: "cutting", "sewing", "laminating", "quality_check", "packaging", "other"

#### 5. Transaction Management Issues
- **Issue**: Transaction rollback errors
- **Solution**: Verify that all database operations within transactions are properly handled with try/catch blocks

## Next Steps

After successfully implementing the Specialized Operations component, you can proceed to:

1. **Inter-Division Transfers Implementation**:
   - Create models for transfers between divisions
   - Implement transfer controllers and routes

2. **Frontend Development**:
   - Begin frontend development for Specialized Operations Management
   - Create UI components for operation tracking
   - Implement material consumption tracking interface
   - Create quality control and results visualization

## Specialized Operations Workflow

The Specialized Operations component implements a complete workflow for detailed manufacturing process management:

### Operation Types
1. **Cutting**: For fabric and material cutting operations
2. **Sewing**: For joining materials with thread
3. **Laminating**: For bonding multiple layers of material
4. **Quality Check**: For inspection and quality control
5. **Packaging**: For final product packaging
6. **Other**: For custom operation types

### Operation Results
The system tracks detailed results for each operation:
- Measurements and test results
- Pass/fail status
- Defect rates
- Quality metrics
- Images and attachments for documentation

### Material Consumption
The system tracks material usage during operations:
- Planned vs. actual material consumption
- Waste tracking
- Efficiency calculations
- Material usage notes

### Efficiency Metrics
The system calculates and reports efficiency metrics:
- Material efficiency (planned vs. actual usage)
- Time efficiency (planned vs. actual duration)
- Quality metrics (defect rates, rejection rates)
- Overall operation performance

This comprehensive tracking enables detailed analysis of manufacturing processes, identification of inefficiencies, and continuous improvement of operations.
