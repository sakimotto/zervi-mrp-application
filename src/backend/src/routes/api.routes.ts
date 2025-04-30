import { Router, Request, Response, NextFunction } from "express";
import { DivisionController } from "../controllers/division.controller";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import specializedOperationRoutes from "./specialized-operation.routes";
import inventoryRoutes from "./inventory.routes";

const router = Router();

// Unprotected routes (no authentication required)
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "OK",
    message: "API is running" 
  });
});

// Auth routes (not protected)
router.post("/auth/login", (req: Request, res: Response, next: NextFunction) => {
  AuthController.login(req, res).catch(next);
});

router.post("/auth/refresh-token", (req: Request, res: Response, next: NextFunction) => {
  AuthController.refreshToken(req, res).catch(next);
});

// Protected routes (require authentication)
// Comment out the line below for initial testing if needed
// router.use(authMiddleware);

// Specialized Operations routes
router.use("/specialized-operations", specializedOperationRoutes);

// Inventory Management routes
router.use("/inventory", inventoryRoutes);

// Division routes
router.get("/divisions", (req: Request, res: Response, next: NextFunction) => {
  DivisionController.getAllDivisions(req, res).catch(next);
});

router.get("/divisions/:id", (req: Request, res: Response, next: NextFunction) => {
  DivisionController.getDivisionById(req, res).catch(next);
});

router.post("/divisions", (req: Request, res: Response, next: NextFunction) => {
  DivisionController.createDivision(req, res).catch(next);
});

router.put("/divisions/:id", (req: Request, res: Response, next: NextFunction) => {
  DivisionController.updateDivision(req, res).catch(next);
});

router.delete("/divisions/:id", (req: Request, res: Response, next: NextFunction) => {
  DivisionController.deleteDivision(req, res).catch(next);
});

// In a complete implementation, we would add all the other routes from api.routes.ts here
// For example:
// router.get("/items", (req, res, next) => ItemController.getAllItems(req, res).catch(next));
// router.get("/boms", (req, res, next) => BomController.getAllBoms(req, res).catch(next));
// etc.

export default router;
