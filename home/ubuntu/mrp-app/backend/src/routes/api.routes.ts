import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";
import { DivisionController } from "../controllers/division.controller";
import { ItemController } from "../controllers/item.controller";
import { BomController } from "../controllers/bom.controller";
import { ManufacturingOrderController } from "../controllers/manufacturing-order.controller";
import { InterDivisionTransferController } from "../controllers/inter-division-transfer.controller";
import { CustomerOrderController } from "../controllers/customer-order.controller";
import { PurchaseOrderController } from "../controllers/purchase-order.controller";
import { CostingController } from "../controllers/costing.controller";
import { SpecializedOperationsController } from "../controllers/specialized-operations.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// Auth routes
router.post("/auth/login", AuthController.login);
router.post("/auth/refresh-token", AuthController.refreshToken);

// Protected routes (require authentication)
router.use(authMiddleware);

// User routes
router.get("/users", roleMiddleware(["admin"]), UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", roleMiddleware(["admin"]), UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", roleMiddleware(["admin"]), UserController.deleteUser);

// Division routes
router.get("/divisions", DivisionController.getAllDivisions);
router.get("/divisions/:id", DivisionController.getDivisionById);
router.post("/divisions", roleMiddleware(["admin"]), DivisionController.createDivision);
router.put("/divisions/:id", roleMiddleware(["admin"]), DivisionController.updateDivision);
router.delete("/divisions/:id", roleMiddleware(["admin"]), DivisionController.deleteDivision);

// Item routes
router.get("/items", ItemController.getAllItems);
router.get("/items/:id", ItemController.getItemById);
router.post("/items", ItemController.createItem);
router.put("/items/:id", ItemController.updateItem);
router.delete("/items/:id", ItemController.deleteItem);

// BOM routes
router.get("/boms", BomController.getAllBoms);
router.get("/boms/:id", BomController.getBomById);
router.post("/boms", BomController.createBom);
router.put("/boms/:id", BomController.updateBom);
router.delete("/boms/:id", BomController.deleteBom);
router.post("/boms/:id/components", BomController.addBomComponent);
router.put("/boms/:id/components/:component_id", BomController.updateBomComponent);
router.delete("/boms/:id/components/:component_id", BomController.deleteBomComponent);

// Manufacturing Order routes
router.get("/manufacturing-orders", ManufacturingOrderController.getAllManufacturingOrders);
router.get("/manufacturing-orders/:id", ManufacturingOrderController.getManufacturingOrderById);
router.post("/manufacturing-orders", ManufacturingOrderController.createManufacturingOrder);
router.put("/manufacturing-orders/:id", ManufacturingOrderController.updateManufacturingOrder);
router.delete("/manufacturing-orders/:id", ManufacturingOrderController.deleteManufacturingOrder);
router.put("/manufacturing-orders/:id/status", ManufacturingOrderController.updateOrderStatus);
router.post("/manufacturing-orders/:id/operations", ManufacturingOrderController.addOperation);
router.put("/manufacturing-orders/:id/operations/:operation_id", ManufacturingOrderController.updateOperation);
router.delete("/manufacturing-orders/:id/operations/:operation_id", ManufacturingOrderController.deleteOperation);

// Inter-Division Transfer routes
router.get("/inter-division-transfers", InterDivisionTransferController.getAllTransfers);
router.get("/inter-division-transfers/:id", InterDivisionTransferController.getTransferById);
router.post("/inter-division-transfers", InterDivisionTransferController.createTransfer);
router.put("/inter-division-transfers/:id", InterDivisionTransferController.updateTransfer);
router.delete("/inter-division-transfers/:id", InterDivisionTransferController.deleteTransfer);
router.post("/inter-division-transfers/:id/process", InterDivisionTransferController.processTransfer);
router.post("/inter-division-transfers/:id/cancel", InterDivisionTransferController.cancelTransfer);

// Customer Order routes
router.get("/customer-orders", CustomerOrderController.getAllOrders);
router.get("/customer-orders/:id", CustomerOrderController.getOrderById);
router.post("/customer-orders", CustomerOrderController.createOrder);
router.put("/customer-orders/:id", CustomerOrderController.updateOrder);
router.delete("/customer-orders/:id", CustomerOrderController.deleteOrder);
router.post("/customer-orders/:id/create-manufacturing-orders", CustomerOrderController.createManufacturingOrders);
router.post("/customer-orders/:id/cancel", CustomerOrderController.cancelOrder);

// Purchase Order routes
router.get("/purchase-orders", PurchaseOrderController.getAllOrders);
router.get("/purchase-orders/:id", PurchaseOrderController.getOrderById);
router.post("/purchase-orders", PurchaseOrderController.createOrder);
router.put("/purchase-orders/:id", PurchaseOrderController.updateOrder);
router.delete("/purchase-orders/:id", PurchaseOrderController.deleteOrder);
router.post("/purchase-orders/:id/send", PurchaseOrderController.sendOrder);
router.post("/purchase-orders/:id/cancel", PurchaseOrderController.cancelOrder);

// Costing routes
router.get("/item-costs", CostingController.getAllItemCosts);
router.get("/item-costs/:id", CostingController.getItemCostById);
router.post("/item-costs", CostingController.createItemCost);
router.put("/item-costs/:id", CostingController.updateItemCost);
router.delete("/item-costs/:id", CostingController.deleteItemCost);
router.get("/pricing-scenarios", CostingController.getAllPricingScenarios);
router.get("/pricing-scenarios/:id", CostingController.getPricingScenarioById);
router.post("/pricing-scenarios", CostingController.createPricingScenario);
router.put("/pricing-scenarios/:id", CostingController.updatePricingScenario);
router.delete("/pricing-scenarios/:id", CostingController.deletePricingScenario);
router.post("/calculate-price", CostingController.calculateItemPrice);

// Specialized Operations routes
// Laminating
router.get("/laminating-operations", SpecializedOperationsController.getAllLaminatingOperations);
router.get("/laminating-operations/:id", SpecializedOperationsController.getLaminatingOperationById);
router.post("/laminating-operations", SpecializedOperationsController.createLaminatingOperation);
router.put("/laminating-operations/:id", SpecializedOperationsController.updateLaminatingOperation);

// Cutting
router.get("/cutting-operations", SpecializedOperationsController.getAllCuttingOperations);
router.get("/cutting-operations/:id", SpecializedOperationsController.getCuttingOperationById);
router.post("/cutting-operations", SpecializedOperationsController.createCuttingOperation);
router.put("/cutting-operations/:id", SpecializedOperationsController.updateCuttingOperation);

// Sewing
router.get("/sewing-operations", SpecializedOperationsController.getAllSewingOperations);
router.get("/sewing-operations/:id", SpecializedOperationsController.getSewingOperationById);
router.post("/sewing-operations", SpecializedOperationsController.createSewingOperation);
router.put("/sewing-operations/:id", SpecializedOperationsController.updateSewingOperation);

// Embroidery
router.get("/embroidery-operations", SpecializedOperationsController.getAllEmbroideryOperations);
router.get("/embroidery-operations/:id", SpecializedOperationsController.getEmbroideryOperationById);
router.post("/embroidery-operations", SpecializedOperationsController.createEmbroideryOperation);
router.put("/embroidery-operations/:id", SpecializedOperationsController.updateEmbroideryOperation);

export default router;
