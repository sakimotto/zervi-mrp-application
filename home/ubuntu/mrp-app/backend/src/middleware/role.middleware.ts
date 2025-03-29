import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user from request (set by authMiddleware)
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Check if user has any of the allowed roles
      if (!user.roles || !user.roles.some((role: string) => allowedRoles.includes(role))) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
