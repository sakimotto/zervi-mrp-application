import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ItemCost } from "../models/item-cost.model";
import { ItemPricing } from "../models/item-pricing.model";
import { PricingScenario } from "../models/pricing-scenario.model";
import { Item } from "../models/item.model";
import { CostType } from "../models/cost-type.model";
import { Currency } from "../models/currency.model";

export class CostingController {
  // Get all item costs
  static async getAllItemCosts(req: Request, res: Response) {
    try {
      const { item_id, cost_type_id } = req.query;
      
      const itemCostRepository = AppDataSource.getRepository(ItemCost);
      let queryBuilder = itemCostRepository.createQueryBuilder("item_cost")
        .leftJoinAndSelect("item_cost.item", "item")
        .leftJoinAndSelect("item_cost.cost_type", "cost_type")
        .leftJoinAndSelect("item_cost.currency", "currency");
      
      // Filter by item if provided
      if (item_id) {
        queryBuilder = queryBuilder.where("item_cost.item_id = :item_id", { item_id });
      }
      
      // Filter by cost type if provided
      if (cost_type_id) {
        const condition = item_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`item_cost.cost_type_id = :cost_type_id`, { cost_type_id });
      }
      
      // Order by effective date descending
      queryBuilder = queryBuilder.orderBy("item_cost.effective_date", "DESC");
      
      const costs = await queryBuilder.getMany();

      return res.status(200).json(costs);
    } catch (error) {
      console.error("Error in getAllItemCosts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get item cost by ID
  static async getItemCostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const itemCostRepository = AppDataSource.getRepository(ItemCost);
      const cost = await itemCostRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["item", "cost_type", "currency"]
      });

      if (!cost) {
        return res.status(404).json({ message: "Item cost not found" });
      }

      return res.status(200).json(cost);
    } catch (error) {
      console.error("Error in getItemCostById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new item cost
  static async createItemCost(req: Request, res: Response) {
    try {
      const { 
        item_id, 
        cost_type_id, 
        cost_amount,
        currency_id,
        effective_date
      } = req.body;

      // Validate required fields
      if (!item_id || !cost_type_id || !cost_amount || !currency_id || !effective_date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate item
      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({ where: { id: item_id } });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Validate cost type
      const costTypeRepository = AppDataSource.getRepository(CostType);
      const costType = await costTypeRepository.findOne({ where: { id: cost_type_id } });
      if (!costType) {
        return res.status(404).json({ message: "Cost type not found" });
      }

      // Validate currency
      const currencyRepository = AppDataSource.getRepository(Currency);
      const currency = await currencyRepository.findOne({ where: { id: currency_id } });
      if (!currency) {
        return res.status(404).json({ message: "Currency not found" });
      }

      // Create new item cost
      const itemCost = new ItemCost();
      itemCost.item_id = item_id;
      itemCost.cost_type_id = cost_type_id;
      itemCost.cost_amount = cost_amount;
      itemCost.currency_id = currency_id;
      itemCost.effective_date = new Date(effective_date);

      const itemCostRepository = AppDataSource.getRepository(ItemCost);
      await itemCostRepository.save(itemCost);

      return res.status(201).json(itemCost);
    } catch (error) {
      console.error("Error in createItemCost:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update item cost
  static async updateItemCost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        cost_amount,
        currency_id,
        effective_date
      } = req.body;

      const itemCostRepository = AppDataSource.getRepository(ItemCost);
      const itemCost = await itemCostRepository.findOne({ where: { id: parseInt(id) } });

      if (!itemCost) {
        return res.status(404).json({ message: "Item cost not found" });
      }

      // Validate currency if changing
      if (currency_id && currency_id !== itemCost.currency_id) {
        const currencyRepository = AppDataSource.getRepository(Currency);
        const currency = await currencyRepository.findOne({ where: { id: currency_id } });
        if (!currency) {
          return res.status(404).json({ message: "Currency not found" });
        }
      }

      // Update item cost fields
      if (cost_amount !== undefined) itemCost.cost_amount = cost_amount;
      if (currency_id) itemCost.currency_id = currency_id;
      if (effective_date) itemCost.effective_date = new Date(effective_date);

      await itemCostRepository.save(itemCost);

      return res.status(200).json(itemCost);
    } catch (error) {
      console.error("Error in updateItemCost:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete item cost
  static async deleteItemCost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const itemCostRepository = AppDataSource.getRepository(ItemCost);
      const itemCost = await itemCostRepository.findOne({ where: { id: parseInt(id) } });

      if (!itemCost) {
        return res.status(404).json({ message: "Item cost not found" });
      }

      await itemCostRepository.remove(itemCost);

      return res.status(200).json({ message: "Item cost deleted successfully" });
    } catch (error) {
      console.error("Error in deleteItemCost:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all pricing scenarios
  static async getAllPricingScenarios(req: Request, res: Response) {
    try {
      const { division_id, status } = req.query;
      
      const scenarioRepository = AppDataSource.getRepository(PricingScenario);
      let queryBuilder = scenarioRepository.createQueryBuilder("scenario")
        .leftJoinAndSelect("scenario.division", "division");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("scenario.division_id = :division_id", { division_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`scenario.status = :status`, { status });
      }
      
      const scenarios = await queryBuilder.getMany();

      return res.status(200).json(scenarios);
    } catch (error) {
      console.error("Error in getAllPricingScenarios:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get pricing scenario by ID
  static async getPricingScenarioById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const scenarioRepository = AppDataSource.getRepository(PricingScenario);
      const scenario = await scenarioRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["division"]
      });

      if (!scenario) {
        return res.status(404).json({ message: "Pricing scenario not found" });
      }

      return res.status(200).json(scenario);
    } catch (error) {
      console.error("Error in getPricingScenarioById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new pricing scenario
  static async createPricingScenario(req: Request, res: Response) {
    try {
      const { 
        division_id, 
        name, 
        description,
        markup_percentage,
        discount_percentage,
        include_indirect_costs,
        status
      } = req.body;

      // Validate required fields
      if (!division_id || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create new pricing scenario
      const scenario = new PricingScenario();
      scenario.division_id = division_id;
      scenario.name = name;
      scenario.description = description || null;
      scenario.markup_percentage = markup_percentage || 0;
      scenario.discount_percentage = discount_percentage || 0;
      scenario.include_indirect_costs = include_indirect_costs || false;
      scenario.status = status || "draft";

      const scenarioRepository = AppDataSource.getRepository(PricingScenario);
      await scenarioRepository.save(scenario);

      return res.status(201).json(scenario);
    } catch (error) {
      console.error("Error in createPricingScenario:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update pricing scenario
  static async updatePricingScenario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        name, 
        description,
        markup_percentage,
        discount_percentage,
        include_indirect_costs,
        status
      } = req.body;

      const scenarioRepository = AppDataSource.getRepository(PricingScenario);
      const scenario = await scenarioRepository.findOne({ where: { id: parseInt(id) } });

      if (!scenario) {
        return res.status(404).json({ message: "Pricing scenario not found" });
      }

      // Update scenario fields
      if (name) scenario.name = name;
      if (description !== undefined) scenario.description = description;
      if (markup_percentage !== undefined) scenario.markup_percentage = markup_percentage;
      if (discount_percentage !== undefined) scenario.discount_percentage = discount_percentage;
      if (include_indirect_costs !== undefined) scenario.include_indirect_costs = include_indirect_costs;
      if (status) scenario.status = status;

      await scenarioRepository.save(scenario);

      return res.status(200).json(scenario);
    } catch (error) {
      console.error("Error in updatePricingScenario:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete pricing scenario
  static async deletePricingScenario(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if scenario is used in any item pricing
      const itemPricingRepository = AppDataSource.getRepository(ItemPricing);
      const usedInPricing = await itemPricingRepository.count({
        where: { pricing_scenario_id: parseInt(id) }
      });

      if (usedInPricing > 0) {
        return res.status(400).json({ 
          message: "Cannot delete pricing scenario that is used in item pricing" 
        });
      }

      const scenarioRepository = AppDataSource.getRepository(PricingScenario);
      const scenario = await scenarioRepository.findOne({ where: { id: parseInt(id) } });

      if (!scenario) {
        return res.status(404).json({ message: "Pricing scenario not found" });
      }

      await scenarioRepository.remove(scenario);

      return res.status(200).json({ message: "Pricing scenario deleted successfully" });
    } catch (error) {
      console.error("Error in deletePricingScenario:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Calculate item price based on costs and pricing scenario
  static async calculateItemPrice(req: Request, res: Response) {
    try {
      const { item_id, pricing_scenario_id, currency_id } = req.body;

      // Validate required fields
      if (!item_id || !pricing_scenario_id) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate item
      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({ where: { id: item_id } });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Validate pricing scenario
      const scenarioRepository = AppDataSource.getRepository(PricingScenario);
      const scenario = await scenarioRepository.findOne({ where: { id: pricing_scenario_id } });
      if (!scenario) {
        return res.status(404).json({ message: "Pricing scenario not found" });
      }

      // Get item costs
      const itemCostRepository = AppDataSource.getRepository(ItemCost);
      const costs = await itemCostRepository.find({
        where: { item_id },
        relations: ["cost_type", "currency"]
      });

      if (costs.length === 0) {
        return res.status(400).json({ message: "No costs defined for this item" });
      }

      // Get default currency if not provided
      let targetCurrencyId = currency_id;
      if (!targetCurrencyId) {
        const currencyRepository = AppDataSource.getRepository(Currency);
        const defaultCurrency = await currencyRepository.findOne({ where: { is_base_currency: true } });
        if (!defaultCurrency) {
          return res.status(400).json({ message: "No base currency defined in the system" });
        }
        targetCurrencyId = defaultCurrency.id;
      }

      // Calculate base cost
      let baseCost = 0;
      for (const cost of costs) {
        // Skip indirect costs if not included in scenario
        if (cost.cost_type.category === "indirect_overhead" && !scenario.include_indirect_costs) {
          continue;
        }

        // Convert to target currency if needed
        let convertedAmount = cost.cost_amount;
        if (cost.currency_id !== targetCurrencyId) {
          // In a real system, you would use exchange rates to convert
          // For simplicity, we'll assume all costs are in the same currency
          convertedAmount = cost.cost_amount;
        }

        baseCost += convertedAmount;
      }

      // Apply markup and discount
      const markupAmount = baseCost * (scenario.markup_percentage / 100);
      const priceAfterMarkup = baseCost + markupAmount;
      const discountAmount = priceAfterMarkup * (scenario.discount_percentage / 100);
      const calculatedPrice = priceAfterMarkup - discountAmount;

      // Create or update item pricing
      const itemPricingRepository = AppDataSource.getRepository(ItemPricing);
      let itemPricing = await itemPricingRepository.findOne({
        where: {
          item_id,
          pricing_scenario_id
        }
      });

      if (itemPricing) {
        // Update existing pricing
        itemPricing.base_cost = baseCost;
        itemPricing.calculated_price = calculatedPrice;
        itemPricing.currency_id = targetCurrencyId;
        itemPricing.effective_date = new Date();
      } else {
        // Create new pricing
        itemPricing = new ItemPricing();
        itemPricing.item_id = item_id;
        itemPricing.pricing_scenario_id = pricing_scenario_id;
        itemPricing.base_cost = baseCost;
        itemPricing.calculated_price = calculatedPrice;
        itemPricing.currency_id = targetCurrencyId;
        itemPricing.effective_date = new Date();
      }

      await itemPricingRepository.save(itemPricing);

      return res.status(200).json({
        item_id,
        pricing_scenario_id,
        base_cost: baseCost,
        markup_percentage: scenario.markup_percentage,
        markup_amount: markupAmount,
        discount_percentage: scenario.discount_percentage,
        discount_amount: discountAmount,
        calculated_price: ca<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>