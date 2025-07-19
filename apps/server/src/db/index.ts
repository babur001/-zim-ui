import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./models/schema";

export const db = drizzle(process.env.DATABASE_URL || "", {
  schema: schema,
});
