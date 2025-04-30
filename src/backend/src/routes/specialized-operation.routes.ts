import { Router } from "express";
import {
  createSpecializedOperation,
  getSpecializedOperationById,
  updateSpecializedOperation,
  deleteSpecializedOperation,
  getSpecializedOperationsByType
} from "../controllers/specialized-operation.controller";

const router = Router();

// Async handler to catch errors from async route handlers
function asyncHandler(fn: Function) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Create a new specialized operation
router.post("/", asyncHandler(createSpecializedOperation));

// Get a specialized operation by ID
router.get("/:id", asyncHandler(getSpecializedOperationById));

// Update a specialized operation
router.put("/:id", asyncHandler(updateSpecializedOperation));

// Delete a specialized operation
router.delete("/:id", asyncHandler(deleteSpecializedOperation));

// Get specialized operations by type
router.get("/type/:operationType", asyncHandler(getSpecializedOperationsByType));

export default router;
