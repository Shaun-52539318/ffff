import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  calculationType: text("calculation_type").notNull(),
  parameters: text("parameters").notNull(), // JSON string
  results: text("results").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  userId: true,
  calculationType: true,
  parameters: true,
  results: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
