import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't need any database schema for this app as everything is client-side
// But we'll keep the file to avoid breaking the build

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define types for our photo editor
export const imageFilterTypes = [
  'normal',
  'grayscale',
  'sepia',
  'invert',
  'blur',
  'vintage',
  'cool',
  'warm',
  'sharpen',
] as const;

export type ImageFilter = typeof imageFilterTypes[number];

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  opacity: number;
}

export interface ImageInfo {
  width: number;
  height: number;
  size: number;
  filename: string;
}
