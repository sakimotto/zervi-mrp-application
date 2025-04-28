import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Auth Middleware
 * 
 * This is a simplified version that just checks for a token.
 * In a real implementation, this would validate JWT tokens properly.
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to continue to next middleware
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    // Simple check for now - in a real app we would validate the JWT
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false, 
        error: { 
          code: "UNAUTHORIZED", 
          message: "Authentication required" 
        } 
      });
      return;
    }

    // For this minimal backend, we'll just pass the request through
    // In a real implementation, we would decode the token and set user info on req
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: "SERVER_ERROR", 
        message: "Internal server error" 
      } 
    });
  }
};
