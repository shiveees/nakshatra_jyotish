import type { Express } from "express";
import { createServer } from "http";
import { insertBirthChartSchema } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(app: Express) {
  app.post("/api/birth-charts", async (req, res) => {
    try {
      const chartData = insertBirthChartSchema.parse(req.body);
      const chart = await storage.createBirthChart(chartData);
      res.json(chart);
    } catch (error) {
      res.status(400).json({ message: "Invalid birth chart data" });
    }
  });

  app.get("/api/birth-charts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const chart = await storage.getBirthChart(id);
    
    if (!chart) {
      res.status(404).json({ message: "Birth chart not found" });
      return;
    }
    
    res.json(chart);
  });

  return createServer(app);
}
