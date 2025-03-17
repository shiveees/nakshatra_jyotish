import { type BirthChart, type InsertBirthChart } from "@shared/schema";

export interface IStorage {
  createBirthChart(chart: InsertBirthChart): Promise<BirthChart>;
  getBirthChart(id: number): Promise<BirthChart | undefined>;
}

export class MemStorage implements IStorage {
  private birthCharts: Map<number, BirthChart>;
  private currentId: number;

  constructor() {
    this.birthCharts = new Map();
    this.currentId = 1;
  }

  async createBirthChart(chart: InsertBirthChart): Promise<BirthChart> {
    const id = this.currentId++;
    const newChart = { ...chart, id };
    this.birthCharts.set(id, newChart);
    return newChart;
  }

  async getBirthChart(id: number): Promise<BirthChart | undefined> {
    return this.birthCharts.get(id);
  }
}

export const storage = new MemStorage();
