import * as p from "drizzle-orm/pg-core";
import { timestamps } from "../utils/timestamps";

export const users = p.pgTable("USERS", {
  id: p.uuid().primaryKey().notNull().defaultRandom(),
  phone: p.varchar({ length: 255 }),
  email: p.varchar({ length: 255 }),
  password: p.text(),
  ...timestamps,
});
