import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Financial calculator routes
  
  // Save calculation results
  app.post("/api/calculations", async (req, res) => {
    try {
      const { calculationType, parameters, results } = req.body;
      
      // In a real app, you might want user authentication here
      const calculation = await storage.createCalculation({
        userId: null, // No user system for now
        calculationType,
        parameters: JSON.stringify(parameters),
        results: JSON.stringify(results)
      });
      
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ error: "Failed to save calculation" });
    }
  });

  // Get calculation history
  app.get("/api/calculations", async (req, res) => {
    try {
      const calculations = await storage.getCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve calculations" });
    }
  });

  // Export calculation results as CSV
  app.get("/api/calculations/:id/export", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const calculation = await storage.getCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }

      // For now, return JSON. In a full implementation, you'd generate CSV
      res.json({
        message: "CSV export not yet implemented",
        calculation
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to export calculation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}