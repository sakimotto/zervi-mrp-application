import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../models/user.model";
import { UserDivisionAccess } from "../models/user-division-access.model";

export class UserController {
  // Get all users
  static async getAllUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        relations: ["role", "division"],
        select: {
          id: true,
          username: true,
          email: true,
          first_name: true,
          last_name: true,
          role_id: true,
          division_id: true,
          is_active: true,
          last_login: true,
          created_at: true,
          updated_at: true
        }
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["role", "division"],
        select: {
          id: true,
          username: true,
          email: true,
          first_name: true,
          last_name: true,
          role_id: true,
          division_id: true,
          is_active: true,
          last_login: true,
          created_at: true,
          updated_at: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error in getUserById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new user
  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, first_name, last_name, role_id, division_id, is_active } = req.body;

      // Check if user already exists
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ 
        where: [{ username }, { email }] 
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = new User();
      user.username = username;
      user.email = email;
      user.password_hash = password; // Password will be hashed in auth controller
      user.first_name = first_name;
      user.last_name = last_name;
      user.role_id = role_id;
      user.division_id = division_id;
      user.is_active = is_active !== undefined ? is_active : true;

      await userRepository.save(user);

      // Return user without password
      const { password_hash, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in createUser:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email, first_name, last_name, role_id, division_id, is_active } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user fields
      if (username) user.username = username;
      if (email) user.email = email;
      if (first_name) user.first_name = first_name;
      if (last_name) user.last_name = last_name;
      if (role_id) user.role_id = role_id;
      if (division_id) user.division_id = division_id;
      if (is_active !== undefined) user.is_active = is_active;

      await userRepository.save(user);

      // Return updated user without password
      const { password_hash, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in updateUser:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await userRepository.remove(user);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get user division access
  static async getUserDivisionAccess(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userDivisionAccessRepository = AppDataSource.getRepository(UserDivisionAccess);
      const divisionAccess = await userDivisionAccessRepository.find({
        where: { user_id: parseInt(id) },
        relations: ["division"]
      });

      return res.status(200).json(divisionAccess);
    } catch (error) {
      console.error("Error in getUserDivisionAccess:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add user division access
  static async addUserDivisionAccess(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { division_id, access_level } = req.body;

      // Check if user exists
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if access already exists
      const userDivisionAccessRepository = AppDataSource.getRepository(UserDivisionAccess);
      const existingAccess = await userDivisionAccessRepository.findOne({
        where: { user_id: parseInt(id), division_id }
      });

      if (existingAccess) {
        // Update existing access
        existingAccess.access_level = access_level;
        await userDivisionAccessRepository.save(existingAccess);
        return res.status(200).json(existingAccess);
      }

      // Create new access
      const newAccess = new UserDivisionAccess();
      newAccess.user_id = parseInt(id);
      newAccess.division_id = division_id;
      newAccess.access_level = access_level;

      await userDivisionAccessRepository.save(newAccess);

      return res.status(201).json(newAccess);
    } catch (error) {
      console.error("Error in addUserDivisionAccess:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Remove user division access
  static async removeUserDivisionAccess(req: Request, res: Response) {
    try {
      const { id, division_id } = req.params;

      const userDivisionAccessRepository = AppDataSource.getRepository(UserDivisionAccess);
      const access = await userDivisionAccessRepository.findOne({
        where: { user_id: parseInt(id), division_id: parseInt(division_id) }
      });

      if (!access) {
        return res.status(404).json({ message: "Division access not found" });
      }

      await userDivisionAccessRepository.remove(access);

      return res.status(200).json({ message: "Division access removed successfully" });
    } catch (error) {
      console.error("Error in removeUserDivisionAccess:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
