import * as p from "drizzle-orm/pg-core";
import { timestamps } from "../utils/timestamps";
import { restrictDeleteUpdateRelations } from "../utils/restrict-delete-update-relations";

export const category = p.pgTable(
  "CATEGORY",
  {
    id: p.uuid().primaryKey().notNull().defaultRandom(),
    slug: p.uuid().notNull().unique(),
    title: p.text().notNull().default(""),
    content: p.text().notNull().default(""),
    icon: p.text().notNull().default(""),
    parent_id: p.uuid(),
    ...timestamps,
  },
  (table) => [
    p
      .foreignKey({
        columns: [table.parent_id],
        foreignColumns: [table.id],
      })
      .onDelete("restrict")
      .onUpdate("restrict"),
  ]
);
