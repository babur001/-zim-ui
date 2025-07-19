import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const timestamps = {
  created_at: p.timestamp({ mode: "string", withTimezone: true }).notNull().defaultNow(),
  updated_at: p.timestamp({ mode: "string", withTimezone: true }).$onUpdate(() => sql`NOW()`),
};
