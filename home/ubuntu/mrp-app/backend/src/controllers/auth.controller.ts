import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  // Register a new user
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, first_name, last_name, role_id, division_id } = req.body;

      // Check if user already exists
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ 
        where: [{ username }, { email }] 
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User();
      user.username = username;
      user.email = email;
      user.password_hash = hashedPassword;
      user.first_name = first_name;
      user.last_name = last_name;
      user.role_id = role_id;
      user.division_id = division_id;
      user.is_active = true;

      await userRepository.save(user);

      // Return user without password
      const { password_hash, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in register:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { username },
        relations: ["role", "division"]
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({ message: "User account is inactive" });
      }

      // Update last login
      user.last_login = new Date();
      await userRepository.save(user);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role_id: user.role_id, division_id: user.division_id },
        process.env.JWT_SECRET || "zervi_mrp_secret_key",
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      // Return user and token
      const { password_hash, ...userWithoutPassword } = user;
      return res.status(200).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response) {
    try {
      // User ID is set by auth middleware
      const userId = (req as any).user.id;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { id: userId },
        relations: ["role", "division"]
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password_hash, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in getProfile:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { currentPassword, newPassword } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password_hash = hashedPassword;
      await userRepository.save(user);

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error in changePassword:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
