// API Routes for Specialized Operations integration
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
