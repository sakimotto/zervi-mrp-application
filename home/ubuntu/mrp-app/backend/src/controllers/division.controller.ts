import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Division } from "../models/division.model";
import { Company } from "../models/company.model";

export class DivisionController {
  // Get all divisions
  static async getAllDivisions(req: Request, res: Response) {
    try {
      const divisionRepository = AppDataSource.getRepository(Division);
      const divisions = await divisionRepository.find({
        relations: ["company"]
      });

      return res.status(200).json(divisions);
    } catch (error) {
      console.error("Error in getAllDivisions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get division by ID
  static async getDivisionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const divisionRepository = AppDataSource.getRepository(Division);
      const division = await divisionRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["company"]
      });

      if (!division) {
        return res.status(404).json({ message: "Division not found" });
      }

      return res.status(200).json(division);
    } catch (error) {
      console.error("Error in getDivisionById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new division
  static async createDivision(req: Request, res: Response) {
    try {
      const { name, description, company_id } = req.body;

      // Check if company exists
      const companyRepository = AppDataSource.getRepository(Company);
      const company = await companyRepository.findOne({ where: { id: company_id } });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Create new division
      const division = new Division();
      division.name = name;
      division.description = description;
      division.company_id = company_id;

      const divisionRepository = AppDataSource.getRepository(Division);
      await divisionRepository.save(division);

      return res.status(201).json(division);
    } catch (error) {
      console.error("Error in createDivision:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update division
  static async updateDivision(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, company_id } = req.body;

      const divisionRepository = AppDataSource.getRepository(Division);
      const division = await divisionRepository.findOne({ where: { id: parseInt(id) } });

      if (!division) {
        return res.status(404).json({ message: "Division not found" });
      }

      // Update division fields
      if (name) division.name = name;
      if (description !== undefined) division.description = description;
      
      if (company_id) {
        // Check if company exists
        const companyRepository = AppDataSource.getRepository(Company);
        const company = await companyRepository.findOne({ where: { id: company_id } });

        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }
        
        division.company_id = company_id;
      }

      await divisionRepository.save(division);

      return res.status(200).json(division);
    } catch (error) {
      console.error("Error in updateDivision:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete division
  static async deleteDivision(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const divisionRepository = AppDataSource.getRepository(Division);
      const division = await divisionRepository.findOne({ where: { id: parseInt(id) } });

      if (!division) {
        return res.status(404).json({ message: "Division not found" });
      }

      await divisionRepository.remove(division);

      return res.status(200).json({ message: "Division deleted successfully" });
    } catch (error) {
      console.error("Error in deleteDivision:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
