import type { ReferenceConfig } from "drizzle-orm/pg-core";

export const restrictDeleteUpdateRelations: ReferenceConfig["actions"] = { onDelete: "restrict", onUpdate: "restrict" };
