import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { SpecializedOperation } from "../models/specialized-operation.model";

// Create a new specialized operation
export const createSpecializedOperation = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const newOperation = specializedOperationRepo.create(req.body);
    const results = await specializedOperationRepo.save(newOperation);
    return res.status(201).json(results);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a specialized operation by ID
export const getSpecializedOperationById = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operation = await specializedOperationRepo.findOne({ where: { id: parseInt(req.params.id, 10) } });
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    return res.status(200).json(operation);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a specialized operation
export const updateSpecializedOperation = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operation = await specializedOperationRepo.findOne({ where: { id: parseInt(req.params.id, 10) } });
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    specializedOperationRepo.merge(operation, req.body);
    const results = await specializedOperationRepo.save(operation);
    return res.status(200).json(results);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a specialized operation
export const deleteSpecializedOperation = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operation = await specializedOperationRepo.findOne({ where: { id: parseInt(req.params.id, 10) } });
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    await specializedOperationRepo.remove(operation);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get specialized operations by type
export const getSpecializedOperationsByType = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operations = await specializedOperationRepo.find({ where: { operation_type: req.params.operationType } });
    return res.status(200).json(operations);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
