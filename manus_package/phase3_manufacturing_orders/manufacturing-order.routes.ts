// Manufacturing Order Routes
import { Router } from "express";
import { ManufacturingOrderController } from "./manufacturing-order.controller";

const router = Router();
const controller = new ManufacturingOrderController();

/**
 * Manufacturing Order Routes
 * 
 * RESTful API routes for managing manufacturing orders
 */

// Basic CRUD operations
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// Specialized operations
router.post("/:id/start", controller.startOrder);
router.post("/:id/complete", controller.completeOrder);
router.post("/:id/cancel", controller.cancelOrder);
router.post("/:id/assign", controller.assignOrder);
router.post("/:id/operations", controller.addOperation);
router.put("/:id/operations/:operationId", controller.updateOperation);
router.delete("/:id/operations/:operationId", controller.deleteOperation);

export { router as manufacturingOrderRoutes };
