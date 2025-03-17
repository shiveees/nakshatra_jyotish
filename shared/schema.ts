import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const birthCharts = pgTable("birth_charts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birthDate: timestamp("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  birthPlace: text("birth_place").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
});

export const insertBirthChartSchema = createInsertSchema(birthCharts).pick({
  name: true,
  birthDate: true,
  birthTime: true,
  birthPlace: true,
  latitude: true,
  longitude: true,
});

export type InsertBirthChart = z.infer<typeof insertBirthChartSchema>;
export type BirthChart = typeof birthCharts.$inferSelect;
