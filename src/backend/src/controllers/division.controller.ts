import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Division } from '../models/division.model';

/**
 * Division Controller
 * 
 * Handles API requests related to divisions in the Zervi MRP application.
 * For this minimal implementation, we're using mock data instead of real database queries.
 */
export class DivisionController {
  
  // Mock data for divisions
  private static mockDivisions = [
    {
      id: 1,
      name: "Automotive",
      description: "Automotive division for car parts and accessories",
      code: "AUTO",
      companyId: 1,
      company: {
        id: 1,
        name: "Zervi Manufacturing"
      }
    },
    {
      id: 2,
      name: "Camping",
      description: "Camping division for outdoor equipment",
      code: "CAMP",
      companyId: 1,
      company: {
        id: 1,
        name: "Zervi Manufacturing"
      }
    },
    {
      id: 3,
      name: "Apparel",
      description: "Apparel division for clothing and textiles",
      code: "APP",
      companyId: 1,
      company: {
        id: 1,
        name: "Zervi Manufacturing"
      }
    },
    {
      id: 4,
      name: "Zervitek",
      description: "Technology division for electronics and gadgets",
      code: "TECH",
      companyId: 1,
      company: {
        id: 1,
        name: "Zervi Manufacturing"
      }
    }
  ];
  
  /**
   * Gets all divisions - using mock data
   */
  static async getAllDivisions(req: Request, res: Response) {
    try {
      // Return in the format expected by the frontend (with value array and Count property)
      return res.status(200).json({
        value: DivisionController.mockDivisions,
        Count: DivisionController.mockDivisions.length
      });
    } catch (error) {
      console.error("Error in getAllDivisions:", error);
      return res.status(500).json({
        message: "Error fetching divisions"
      });
    }
  }
  
  /**
   * Gets a specific division by ID
   */
  static async getDivisionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const divisionId = parseInt(id);
      
      // Find division in mock data
      const division = DivisionController.mockDivisions.find(d => d.id === divisionId);
      
      if (!division) {
        return res.status(404).json({
          message: `Division with ID ${id} not found`
        });
      }
      
      // Return the division object directly, not wrapped in a success object
      return res.status(200).json({
        value: division,
        Count: 1
      });
    } catch (error) {
      console.error("Error in getDivisionById:", error);
      return res.status(500).json({
        message: "Error fetching division"
      });
    }
  }
  
  /**
   * Creates a new division - mock implementation
   */
  static async createDivision(req: Request, res: Response) {
    try {
      const { name, description, code, companyId = 1 } = req.body;
      
      // Simple validation
      if (!name) {
        return res.status(400).json({
          message: "Division name is required"
        });
      }
      
      // Create a new mock division with an incremented ID
      const newId = Math.max(...DivisionController.mockDivisions.map(d => d.id)) + 1;
      
      const newDivision = {
        id: newId,
        name,
        description: description || "",
        code: code || `DIV-${newId}`,
        companyId: companyId,
        company: {
          id: companyId,
          name: "Zervi Manufacturing"
        }
      };
      
      // Add to mock data
      DivisionController.mockDivisions.push(newDivision);
      
      // Return the created division directly
      return res.status(201).json({
        value: newDivision,
        Count: 1
      });
    } catch (error) {
      console.error("Error in createDivision:", error);
      return res.status(500).json({
        message: "Error creating division"
      });
    }
  }
  
  /**
   * Updates an existing division - mock implementation
   */
  static async updateDivision(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const divisionId = parseInt(id);
      const { name, description, code } = req.body;
      
      // Find division in mock data
      const divisionIndex = DivisionController.mockDivisions.findIndex(d => d.id === divisionId);
      
      if (divisionIndex === -1) {
        return res.status(404).json({
          message: `Division with ID ${id} not found`
        });
      }
      
      // Update fields
      const division = DivisionController.mockDivisions[divisionIndex];
      const updatedDivision = {
        ...division,
        name: name || division.name,
        description: description !== undefined ? description : division.description,
        code: code !== undefined ? code : division.code
      };
      
      // Replace in mock data
      DivisionController.mockDivisions[divisionIndex] = updatedDivision;
      
      // Return the updated division directly
      return res.status(200).json({
        value: updatedDivision,
        Count: 1
      });
    } catch (error) {
      console.error("Error in updateDivision:", error);
      return res.status(500).json({
        message: "Error updating division"
      });
    }
  }
  
  /**
   * Deletes a division - mock implementation
   */
  static async deleteDivision(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const divisionId = parseInt(id);
      
      // Find division in mock data
      const divisionIndex = DivisionController.mockDivisions.findIndex(d => d.id === divisionId);
      
      if (divisionIndex === -1) {
        return res.status(404).json({
          message: `Division with ID ${id} not found`
        });
      }
      
      // Remove from mock data
      DivisionController.mockDivisions.splice(divisionIndex, 1);
      
      // Return empty response for deletion
      return res.status(204).send();
    } catch (error) {
      console.error("Error in deleteDivision:", error);
      return res.status(500).json({
        message: "Error deleting division"
      });
    }
  }
}
