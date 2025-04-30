import { Router } from "express";
import { ItemController } from "../controllers/item.controller";
import { LotTrackingController } from "../controllers/lot-tracking.controller";
import { FabricRollController } from "../controllers/fabric-roll.controller";

const router = Router();

// Initialize controllers
const itemController = new ItemController();
const lotController = new LotTrackingController();
const fabricRollController = new FabricRollController();

/**
 * Item Routes
 * Endpoints for managing inventory items
 */
// Get all items with optional filtering
router.get("/items", (req, res) => itemController.getAllItems(req, res));

// Get item by ID
router.get("/items/:id", (req, res) => itemController.getItemById(req, res));

// Get item by item code
router.get("/items/code/:code", (req, res) => itemController.getItemByCode(req, res));

// Create new item
router.post("/items", (req, res) => itemController.createItem(req, res));

// Update existing item
router.put("/items/:id", (req, res) => itemController.updateItem(req, res));

// Delete item
router.delete("/items/:id", (req, res) => itemController.deleteItem(req, res));

// Specialized item endpoints
router.get("/items/batch-tracking", (req, res) => itemController.getBatchTrackingItems(req, res));
router.get("/items/serial-tracking", (req, res) => itemController.getSerialTrackingItems(req, res));
router.get("/items/splittable", (req, res) => itemController.getSplittableItems(req, res));

// Enable features for items
router.patch("/items/:id/enable-batch-tracking", (req, res) => itemController.enableBatchTracking(req, res));
router.patch("/items/:id/enable-serial-tracking", (req, res) => itemController.enableSerialTracking(req, res));
router.patch("/items/:id/enable-split-functionality", (req, res) => itemController.enableSplitFunctionality(req, res));

/**
 * Lot Tracking Routes
 * Endpoints for managing batches/lots
 */
// Get all lots with optional filtering
router.get("/lots", (req, res) => lotController.getAllLots(req, res));

// Get lot by ID
router.get("/lots/:id", (req, res) => lotController.getLotById(req, res));

// Get lots by item
router.get("/items/:itemId/lots", (req, res) => lotController.getLotsByItem(req, res));

// Create new lot
router.post("/lots", (req, res) => lotController.createLot(req, res));

// Update existing lot
router.put("/lots/:id", (req, res) => lotController.updateLot(req, res));

// Delete lot
router.delete("/lots/:id", (req, res) => lotController.deleteLot(req, res));

// Split lot
router.post("/lots/:id/split", (req, res) => lotController.splitLot(req, res));

// Get expiring lots
router.get("/lots/expiring", (req, res) => lotController.getExpiringLots(req, res));

// Update quality status
router.patch("/lots/:id/quality-status", (req, res) => lotController.updateQualityStatus(req, res));

/**
 * Fabric Roll Routes
 * Endpoints for managing specialized fabric rolls
 */
// Get all fabric rolls with optional filtering
router.get("/fabric-rolls", (req, res) => fabricRollController.getAllRolls(req, res));

// Get fabric roll by ID
router.get("/fabric-rolls/:id", (req, res) => fabricRollController.getRollById(req, res));

// Get fabric rolls by lot
router.get("/lots/:lotId/fabric-rolls", (req, res) => fabricRollController.getRollsByLot(req, res));

// Create new fabric roll
router.post("/fabric-rolls", (req, res) => fabricRollController.createRoll(req, res));

// Update existing fabric roll
router.put("/fabric-rolls/:id", (req, res) => fabricRollController.updateRoll(req, res));

// Delete fabric roll
router.delete("/fabric-rolls/:id", (req, res) => fabricRollController.deleteRoll(req, res));

// Split fabric roll
router.post("/fabric-rolls/:id/split", (req, res) => fabricRollController.splitRoll(req, res));

// Get child rolls (split history)
router.get("/fabric-rolls/:parentId/children", (req, res) => fabricRollController.getChildRolls(req, res));

export default router;
