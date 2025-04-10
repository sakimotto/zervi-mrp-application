// API Routes for Manufacturing Orders integration
import { Router } from "express";
import { manufacturingOrderRoutes } from "./manufacturing-order.routes";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * Manufacturing Orders API Routes
 * Routes for managing manufacturing orders in the Zervi MRP system
 */

// Apply authentication middleware to all manufacturing order routes
router.use("/manufacturing-orders", authMiddleware, manufacturingOrderRoutes);

export { router as manufacturingOrderAPIRoutes };
