import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { SpecializedOperation } from "./specialized-operation.model";

// Create a new specialized operation
export const createSpecializedOperation = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const newOperation = specializedOperationRepo.create(req.body);
    const results = await specializedOperationRepo.save(newOperation);
    return res.status(201).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a specialized operation by ID
export const getSpecializedOperationById = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operation = await specializedOperationRepo.findOne(req.params.id);
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    return res.status(200).json(operation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a specialized operation
export const updateSpecializedOperation = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operation = await specializedOperationRepo.findOne(req.params.id);
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    specializedOperationRepo.merge(operation, req.body);
    const results = await specializedOperationRepo.save(operation);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a specialized operation
export const deleteSpecializedOperation = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const results = await specializedOperationRepo.delete(req.params.id);
    if (results.affected === 0) {
      return res.status(404).json({ message: "Operation not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get specialized operations by type
export const getSpecializedOperationsByType = async (req: Request, res: Response) => {
  try {
    const specializedOperationRepo = getRepository(SpecializedOperation);
    const operations = await specializedOperationRepo.find({
      where: { operation_type: req.params.operationType }
    });
    return res.status(200).json(operations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
