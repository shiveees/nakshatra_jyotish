import { birthCharts, type BirthChart, type InsertBirthChart } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createBirthChart(chart: InsertBirthChart): Promise<BirthChart>;
  getBirthChart(id: number): Promise<BirthChart | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createBirthChart(chart: InsertBirthChart): Promise<BirthChart> {
    const [newChart] = await db
      .insert(birthCharts)
      .values(chart)
      .returning();
    return newChart;
  }

  async getBirthChart(id: number): Promise<BirthChart | undefined> {
    const [chart] = await db
      .select()
      .from(birthCharts)
      .where(eq(birthCharts.id, id));
    return chart;
  }
}

export const storage = new DatabaseStorage();