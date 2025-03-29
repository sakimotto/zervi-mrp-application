import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Bom } from "../models/bom.model";
import { BomComponent } from "../models/bom-component.model";
import { Item } from "../models/item.model";
import { UnitOfMeasurement } from "../models/unit-of-measurement.model";

export class BomController {
  // Get all BOMs
  static async getAllBoms(req: Request, res: Response) {
    try {
      const { division_id } = req.query;
      
      const bomRepository = AppDataSource.getRepository(Bom);
      let queryBuilder = bomRepository.createQueryBuilder("bom")
        .leftJoinAndSelect("bom.item", "item")
        .leftJoinAndSelect("bom.division", "division");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("bom.division_id = :division_id", { division_id });
      }
      
      const boms = await queryBuilder.getMany();

      return res.status(200).json(boms);
    } catch (error) {
      console.error("Error in getAllBoms:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get BOM by ID
  static async getBomById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const bomRepository = AppDataSource.getRepository(Bom);
      const bom = await bomRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["division", "item"]
      });

      if (!bom) {
        return res.status(404).json({ message: "BOM not found" });
      }

      // Get BOM components
      const bomComponentRepository = AppDataSource.getRepository(BomComponent);
      const components = await bomComponentRepository.find({
        where: { bom_id: parseInt(id) },
        relations: ["component_item", "uom", "parent_component"],
        order: { level_number: "ASC", position: "ASC" }
      });

      // Return BOM with components
      return res.status(200).json({
        ...bom,
        components
      });
    } catch (error) {
      console.error("Error in getBomById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new BOM
  static async createBom(req: Request, res: Response) {
    try {
      const { 
        division_id, 
        item_id, 
        name, 
        description, 
        version,
        bom_level,
        status,
        effective_date,
        components
      } = req.body;

      // Validate required fields
      if (!division_id || !item_id || !name || !version || !effective_date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate item
      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({ where: { id: item_id } });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Create new BOM
        const bom = new Bom();
        bom.division_id = division_id;
        bom.item_id = item_id;
        bom.name = name;
        bom.description = description || null;
        bom.version = version;
        bom.bom_level = bom_level || "top_level";
        bom.status = status || "draft";
        bom.effective_date = new Date(effective_date);

        const savedBom = await queryRunner.manager.save(bom);

        // Create BOM components if provided
        if (components && Array.isArray(components) && components.length > 0) {
          for (const comp of components) {
            // Validate component item
            const componentItem = await itemRepository.findOne({ where: { id: comp.component_item_id } });
            if (!componentItem) {
              throw new Error(`Component item with ID ${comp.component_item_id} not found`);
            }

            // Validate UOM
            const uomRepository = AppDataSource.getRepository(UnitOfMeasurement);
            const uom = await uomRepository.findOne({ where: { id: comp.uom_id } });
            if (!uom) {
              throw new Error(`Unit of measurement with ID ${comp.uom_id} not found`);
            }

            // Validate parent component if provided
            if (comp.parent_component_id) {
              const parentComponent = await queryRunner.manager.findOne(BomComponent, { 
                where: { id: comp.parent_component_id, bom_id: savedBom.id } 
              });
              if (!parentComponent) {
                throw new Error(`Parent component with ID ${comp.parent_component_id} not found in this BOM`);
              }
            }

            // Create component
            const bomComponent = new BomComponent();
            bomComponent.bom_id = savedBom.id;
            bomComponent.component_item_id = comp.component_item_id;
            bomComponent.component_type = comp.component_type || componentItem.type;
            bomComponent.quantity = comp.quantity;
            bomComponent.uom_id = comp.uom_id;
            bomComponent.position = comp.position || 0;
            bomComponent.parent_component_id = comp.parent_component_id || null;
            bomComponent.level_number = comp.level_number || 0;
            bomComponent.notes = comp.notes || null;
            bomComponent.is_critical = comp.is_critical || false;

            await queryRunner.manager.save(bomComponent);
          }
        }

        // Commit transaction
        await queryRunner.commitTransaction();

        // Get complete BOM with components
        const completeBom = await this.getBomById({ params: { id: savedBom.id.toString() } } as Request, res as Response);
        
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in createBom:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  // Update BOM
  static async updateBom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        name, 
        description, 
        version,
        bom_level,
        status,
        effective_date
      } = req.body;

      const bomRepository = AppDataSource.getRepository(Bom);
      const bom = await bomRepository.findOne({ where: { id: parseInt(id) } });

      if (!bom) {
        return res.status(404).json({ message: "BOM not found" });
      }

      // Update BOM fields
      if (name) bom.name = name;
      if (description !== undefined) bom.description = description;
      if (version) bom.version = version;
      if (bom_level) bom.bom_level = bom_level;
      if (status) bom.status = status;
      if (effective_date) bom.effective_date = new Date(effective_date);

      await bomRepository.save(bom);

      // Get updated BOM with components
      return this.getBomById(req, res);
    } catch (error) {
      console.error("Error in updateBom:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete BOM
  static async deleteBom(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Delete BOM components first
        const bomComponentRepository = AppDataSource.getRepository(BomComponent);
        await bomComponentRepository.delete({ bom_id: parseInt(id) });

        // Delete BOM
        const bomRepository = AppDataSource.getRepository(Bom);
        const bom = await bomRepository.findOne({ where: { id: parseInt(id) } });

        if (!bom) {
          return res.status(404).json({ message: "BOM not found" });
        }

        await bomRepository.remove(bom);

        // Commit transaction
        await queryRunner.commitTransaction();

        return res.status(200).json({ message: "BOM deleted successfully" });
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in deleteBom:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add component to BOM
  static async addBomComponent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        component_item_id,
        component_type,
        quantity,
        uom_id,
        position,
        parent_component_id,
        level_number,
        notes,
        is_critical
      } = req.body;

      // Validate required fields
      if (!component_item_id || !quantity || !uom_id) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate BOM
      const bomRepository = AppDataSource.getRepository(Bom);
      const bom = await bomRepository.findOne({ where: { id: parseInt(id) } });
      if (!bom) {
        return res.status(404).json({ message: "BOM not found" });
      }

      // Validate component item
      const itemRepository = AppDataSource.getRepository(Item);
      const componentItem = await itemRepository.findOne({ where: { id: component_item_id } });
      if (!componentItem) {
        return res.status(404).json({ message: "Component item not found" });
      }

      // Validate UOM
      const uomRepository = AppDataSource.getRepository(UnitOfMeasurement);
      const uom = await uomRepository.findOne({ where: { id: uom_id } });
      if (!uom) {
        return res.status(404).json({ message: "Unit of measurement not found" });
      }

      // Validate parent component if provided
      if (parent_component_id) {
        const bomComponentRepository = AppDataSource.getRepository(BomComponent);
        const parentComponent = await bomComponentRepository.findOne({ 
          where: { id: parent_component_id, bom_id: parseInt(id) } 
        });
        if (!parentComponent) {
          return res.status(404).json({ message: "Parent component not found in this BOM" });
        }
      }

      // Create component
      const bomComponent = new BomComponent();
      bomComponent.bom_id = parseInt(id);
      bomComponent.component_item_id = component_item_id;
      bomComponent.component_type = component_type || componentItem.type;
      bomComponent.quantity = quantity;
      bomComponent.uom_id = uom_id;
      bomComponent.position = position || 0;
      bomComponent.parent_component_id = parent_component_id || null;
      bomComponent.level_number = level_number || 0;
      bomComponent.notes = notes || null;
      bomComponent.is_critical = is_critical || false;

      const bomComponentRepository = AppDataSource.getRepository(BomComponent);
      await bomComponentRepository.save(bomComponent);

      return res.status(201).json(bomComponent);
    } catch (error) {
      console.error("Error in addBomComponent:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update BOM component
  static async updateBomComponent(req: Request, res: Response) {
    try {
      const { id, component_id } = req.params;
      const {
        component_item_id,
        component_type,
        quantity,
        uom_id,
        position,
        parent_component_id,
        level_number,
        notes,
        is_critical
      } = req.body;

      // Validate BOM
      const bomRepository = AppDataSource.getRepository(Bom);
      const bom = await bomRepository.findOne({ where: { id: parseInt(id) } });
      if (!bom) {
        return res.status(404).json({ message: "BOM not found" });
      }

      // Validate component
      const bomComponentRepository = AppDataSource.getRepository(BomComponent);
      const component = await bomComponentRepository.findOne({ 
        where: { id: parseInt(component_id), bom_id: parseInt(id) } 
      });
      if (!component) {
        return res.status(404).json({ message: "Component not found in this BOM" });
      }

      // Validate component item if changing
      if (component_item_id && component_item_id !== component.component_item_id) {
        const itemRepository = AppDataSource.getRepository(Item);
        const componentItem = await itemRepository.findOne({ where: { id: component_item_id } });
        if (!componentItem) {
          return res.status(404).json({ message: "Component item not found" });
        }
      }

      // Validate UOM if changing
      if (uom_id && uom_id !== component.uom_id) {
        const uomRepository = AppDataSource.getRepository(UnitOfMeasurement);
        const uom = await uomRepository.findOne({ where: { id: uom_id } });
        if (!uom) {
          return res.status(404).json({ message: "Unit of measurement not found" });
        }
      }

      // Validate parent component if changing
      if (parent_component_id && parent_component_id !== component.parent_component_id) {
        const parentComponent = await bomComponentRepository.findOne({ 
          where: { id: parent_component_id, bom_id: parseInt(id) } 
        });
        if (!parentComponent) {
          return res.status(404).json({ message: "Parent component not found in this BOM" });
        }
      }

      // Update component fields
      if (component_item_id) component.component_item_id = component_item_id;
      if (component_type) component.component_type = component_type;
      if (quantity !== undefined) component.quantity = quantity;
      if (uom_id) component.uom_id = uom_id;
      if (position !== undefined) component.position = position;
      if (parent_component_id !== undefined) component.parent_component_id = parent_component_id;
      if (level_number !== undefined) component.level_number = level_number;
      if (notes !== undefined) component.notes = notes;
      if (is_critical !== undefined) component.is_critical = is_critical;

      await bomComponentRepository.save(component);

      return res.status(200).json(component);
    } catch (error) {
      console.error("Error in updateBomComponent:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete BOM component
  static async deleteBomComponent(req: Request, res: Response) {
    try {
      const { id, component_id } = req.params;

      // Validate BOM
      const bomRepository = AppDataSource.getRepository(Bom);
      const bom = await bomRepository.findOne({ where: { id: parseInt(id) } });
      if (!bom) {
        return res.status(404).json({ message: "BOM not found" });
      }

      // Validate component
      const bomComponentRepository = AppDataSource.getRepository(BomComponent);
      const component = await bomComponentRepository.findOne({ 
        where: { id: parseInt(component_id), bom_id: parseInt(id) } 
      });
      if (!component) {
        return res.status(404).json({ message: "Component not found in this BOM" });
      }

      // Check if this component is a parent of other components
      const childComponents = await bomComponentRepository.find({
        where: { parent_component_id: parseInt(component_id) }
      });

      if (childComponents.length > 0) {
        return res.status(400).json({ 
          message: "Cannot delete component with child components. Remove child components first." 
        });
      }

      await bomComponentRepository.remove(component);

      return res.status(200).json({ message: "Component deleted successfully" });
    } catch (error) {
      console.error("Error in deleteBomComponent:", erro<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>