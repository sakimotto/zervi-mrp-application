import { Router } from "express";
import {
  createSpecializedOperation,
  getSpecializedOperationById,
  updateSpecializedOperation,
  deleteSpecializedOperation,
  getSpecializedOperationsByType
} from "./specialized-operation.controller";

const router = Router();

// Create a new specialized operation
router.post("/", createSpecializedOperation);

// Get a specialized operation by ID
router.get("/:id", getSpecializedOperationById);

// Update a specialized operation
router.put("/:id", updateSpecializedOperation);

// Delete a specialized operation
router.delete("/:id", deleteSpecializedOperation);

// Get specialized operations by type
router.get("/type/:operationType", getSpecializedOperationsByType);

export default router;
