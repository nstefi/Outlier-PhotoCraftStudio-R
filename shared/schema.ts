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

// Define blend modes for layers
export const blendModeTypes = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
] as const;

export type BlendMode = typeof blendModeTypes[number];

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

// Layer related types
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  image: HTMLImageElement | null;
  filter: ImageFilter;
  adjustments: ImageAdjustments;
  blendMode: BlendMode;
  position: {
    x: number;
    y: number;
  };
  scale: number;
}
