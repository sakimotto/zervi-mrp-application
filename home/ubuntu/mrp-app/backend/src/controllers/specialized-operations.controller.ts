import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { LaminatingOperation } from "../models/laminating-operation.model";
import { CuttingOperation } from "../models/cutting-operation.model";
import { SewingOperation } from "../models/sewing-operation.model";
import { EmbroideryOperation } from "../models/embroidery-operation.model";
import { ManufacturingOrderOperation } from "../models/manufacturing-order-operation.model";
import { Workstation } from "../models/workstation.model";

export class SpecializedOperationsController {
  // Laminating Operations
  static async getAllLaminatingOperations(req: Request, res: Response) {
    try {
      const { division_id, workstation_id, status } = req.query;
      
      const operationRepository = AppDataSource.getRepository(LaminatingOperation);
      let queryBuilder = operationRepository.createQueryBuilder("operation")
        .leftJoinAndSelect("operation.manufacturing_order_operation", "mo_operation")
        .leftJoinAndSelect("mo_operation.manufacturing_order", "mo")
        .leftJoinAndSelect("operation.workstation", "workstation");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("mo.division_id = :division_id", { division_id });
      }
      
      // Filter by workstation if provided
      if (workstation_id) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`operation.workstation_id = :workstation_id`, { workstation_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = (division_id || workstation_id) ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`operation.status = :status`, { status });
      }
      
      const operations = await queryBuilder.getMany();

      return res.status(200).json(operations);
    } catch (error) {
      console.error("Error in getAllLaminatingOperations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getLaminatingOperationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const operationRepository = AppDataSource.getRepository(LaminatingOperation);
      const operation = await operationRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["manufacturing_order_operation", "manufacturing_order_operation.manufacturing_order", "workstation"]
      });

      if (!operation) {
        return res.status(404).json({ message: "Laminating operation not found" });
      }

      return res.status(200).json(operation);
    } catch (error) {
      console.error("Error in getLaminatingOperationById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createLaminatingOperation(req: Request, res: Response) {
    try {
      const { 
        manufacturing_order_operation_id,
        workstation_id,
        material_type,
        temperature,
        pressure,
        dwell_time,
        adhesive_type,
        adhesive_amount,
        status,
        notes
      } = req.body;

      // Validate required fields
      if (!manufacturing_order_operation_id || !workstation_id || !material_type || !temperature || !pressure || !dwell_time) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate manufacturing order operation
      const moOperationRepository = AppDataSource.getRepository(ManufacturingOrderOperation);
      const moOperation = await moOperationRepository.findOne({ 
        where: { id: manufacturing_order_operation_id },
        relations: ["operation"]
      });
      
      if (!moOperation) {
        return res.status(404).json({ message: "Manufacturing order operation not found" });
      }
      
      if (moOperation.operation.operation_type !== "laminating") {
        return res.status(400).json({ message: "Manufacturing order operation is not a laminating operation" });
      }

      // Validate workstation
      const workstationRepository = AppDataSource.getRepository(Workstation);
      const workstation = await workstationRepository.findOne({ 
        where: { id: workstation_id, type: "laminating" }
      });
      
      if (!workstation) {
        return res.status(404).json({ message: "Laminating workstation not found" });
      }

      // Create new laminating operation
      const operation = new LaminatingOperation();
      operation.manufacturing_order_operation_id = manufacturing_order_operation_id;
      operation.workstation_id = workstation_id;
      operation.material_type = material_type;
      operation.temperature = temperature;
      operation.pressure = pressure;
      operation.dwell_time = dwell_time;
      operation.adhesive_type = adhesive_type || null;
      operation.adhesive_amount = adhesive_amount || null;
      operation.status = status || "pending";
      operation.notes = notes || null;

      const operationRepository = AppDataSource.getRepository(LaminatingOperation);
      await operationRepository.save(operation);

      return res.status(201).json(operation);
    } catch (error) {
      console.error("Error in createLaminatingOperation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateLaminatingOperation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        workstation_id,
        material_type,
        temperature,
        pressure,
        dwell_time,
        adhesive_type,
        adhesive_amount,
        status,
        notes
      } = req.body;

      const operationRepository = AppDataSource.getRepository(LaminatingOperation);
      const operation = await operationRepository.findOne({ where: { id: parseInt(id) } });

      if (!operation) {
        return res.status(404).json({ message: "Laminating operation not found" });
      }

      // Validate workstation if changing
      if (workstation_id && workstation_id !== operation.workstation_id) {
        const workstationRepository = AppDataSource.getRepository(Workstation);
        const workstation = await workstationRepository.findOne({ 
          where: { id: workstation_id, type: "laminating" }
        });
        
        if (!workstation) {
          return res.status(404).json({ message: "Laminating workstation not found" });
        }
      }

      // Update operation fields
      if (workstation_id) operation.workstation_id = workstation_id;
      if (material_type) operation.material_type = material_type;
      if (temperature !== undefined) operation.temperature = temperature;
      if (pressure !== undefined) operation.pressure = pressure;
      if (dwell_time !== undefined) operation.dwell_time = dwell_time;
      if (adhesive_type !== undefined) operation.adhesive_type = adhesive_type;
      if (adhesive_amount !== undefined) operation.adhesive_amount = adhesive_amount;
      if (status) operation.status = status;
      if (notes !== undefined) operation.notes = notes;

      await operationRepository.save(operation);

      return res.status(200).json(operation);
    } catch (error) {
      console.error("Error in updateLaminatingOperation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Cutting Operations
  static async getAllCuttingOperations(req: Request, res: Response) {
    try {
      const { division_id, workstation_id, status } = req.query;
      
      const operationRepository = AppDataSource.getRepository(CuttingOperation);
      let queryBuilder = operationRepository.createQueryBuilder("operation")
        .leftJoinAndSelect("operation.manufacturing_order_operation", "mo_operation")
        .leftJoinAndSelect("mo_operation.manufacturing_order", "mo")
        .leftJoinAndSelect("operation.workstation", "workstation");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("mo.division_id = :division_id", { division_id });
      }
      
      // Filter by workstation if provided
      if (workstation_id) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`operation.workstation_id = :workstation_id`, { workstation_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = (division_id || workstation_id) ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`operation.status = :status`, { status });
      }
      
      const operations = await queryBuilder.getMany();

      return res.status(200).json(operations);
    } catch (error) {
      console.error("Error in getAllCuttingOperations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCuttingOperationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const operationRepository = AppDataSource.getRepository(CuttingOperation);
      const operation = await operationRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["manufacturing_order_operation", "manufacturing_order_operation.manufacturing_order", "workstation"]
      });

      if (!operation) {
        return res.status(404).json({ message: "Cutting operation not found" });
      }

      return res.status(200).json(operation);
    } catch (error) {
      console.error("Error in getCuttingOperationById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createCuttingOperation(req: Request, res: Response) {
    try {
      const { 
        manufacturing_order_operation_id,
        workstation_id,
        cutting_method,
        material_thickness,
        blade_type,
        cutting_speed,
        pattern_file,
        material_utilization,
        status,
        notes
      } = req.body;

      // Validate required fields
      if (!manufacturing_order_operation_id || !workstation_id || !cutting_method || !material_thickness) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate manufacturing order operation
      const moOperationRepository = AppDataSource.getRepository(ManufacturingOrderOperation);
      const moOperation = await moOperationRepository.findOne({ 
        where: { id: manufacturing_order_operation_id },
        relations: ["operation"]
      });
      
      if (!moOperation) {
        return res.status(404).json({ message: "Manufacturing order operation not found" });
      }
      
      if (moOperation.operation.operation_type !== "cutting") {
        return res.status(400).json({ message: "Manufacturing order operation is not a cutting operation" });
      }

      // Validate workstation
      const workstationRepository = AppDataSource.getRepository(Workstation);
      const workstation = await workstationRepository.findOne({ 
        where: { id: workstation_id, type: "cutting" }
      });
      
      if (!workstation) {
        return res.status(404).json({ message: "Cutting workstation not found" });
      }

      // Create new cutting operation
      const operation = new CuttingOperation();
      operation.manufacturing_order_operation_id = manufacturing_order_operation_id;
      operation.workstation_id = workstation_id;
      operation.cutting_method = cutting_method;
      operation.material_thickness = material_thickness;
      operation.blade_type = blade_type || null;
      operation.cutting_speed = cutting_speed || null;
      operation.pattern_file = pattern_file || null;
      operation.material_utilization = material_utilization || null;
      operation.status = status || "pending";
      operation.notes = notes || null;

      const operationRepository = AppDataSource.getRepository(CuttingOperation);
      await operationRepository.save(operation);

      return res.status(201).json(operation);
    } catch (error) {
      console.error("Error in createCuttingOperation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateCuttingOperation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        workstation_id,
        cutting_method,
        material_thickness,
        blade_type,
        cutting_speed,
        pattern_file,
        material_utilization,
        status,
        notes
      } = req.body;

      const operationRepository = AppDataSource.getRepository(CuttingOperation);
      const operation = await operationRepository.findOne({ where: { id: parseInt(id) } });

      if (!operation) {
        return res.status(404).json({ message: "Cutting operation not found" });
      }

      // Validate workstation if changing
      if (workstation_id && workstation_id !== operation.workstation_id) {
        const workstationRepository = AppDataSource.getRepository(Workstation);
        const workstation = await workstationRepository.findOne({ 
          where: { id: workstation_id, type: "cutting" }
        });
        
        if (!workstation) {
          return res.status(404).json({ message: "Cutting workstation not found" });
        }
      }

      // Update operation fields
      if (workstation_id) operation.workstation_id = workstation_id;
      if (cutting_method) operation.cutting_method = cutting_method;
      if (material_thickness !== undefined) operation.material_thickness = material_thickness;
      if (blade_type !== undefined) operation.blade_type = blade_type;
      if (cutting_speed !== undefined) operation.cutting_speed = cutting_speed;
      if (pattern_file !== undefined) operation.pattern_file = pattern_file;
      if (material_utilization !== undefined) operation.material_utilization = material_utilization;
      if (status) operation.status = status;
      if (notes !== undefined) operation.notes = notes;

      await operationRepository.save(operation);

      return res.status(200).json(operation);
    } catch (error) {
      console.error("Error in updateCuttingOperation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Sewing Operations
  static async getAllSewingOperations(req: Request, res: Response) {
    try {
      const { division_id, workstation_id, status } = req.query;
      
      const operationRepository = AppDataSource.getRepository(SewingOperation);
      let queryBuilder = operationRepository.createQueryBuilder("operation")
        .leftJoinAndSelect("operation.manufacturing_order_operation", "mo_operation")
        .leftJoinAndSelect("mo_operation.manufacturing_order", "mo")
        .leftJoinAndSelect("operation.workstation", "workstation");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("mo.division_id = :division_id", { division_id });
      }
      
      // Filter by workstation if provided
      if (workstation_id) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`operation.workstation_id = :workstation_id`, { workstation_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = (division_id || workstation_id) ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`operation.status = :status`, { status });
      }
      
      const operations = await queryBuilder.getMany();

      return res.status(200).json(operations);
    } catch (error) {
      console.error("Error in getAllSewingOperations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getSewingOperationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const operationRepository <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>