import * as p from "drizzle-orm/pg-core";
import { timestamps } from "../utils/timestamps";
import { restrictDeleteUpdateRelations } from "../utils/restrict-delete-update-relations";
import { relations } from "drizzle-orm";

export const condition = p.pgEnum("ENUM_CONDITION", ["new", "old", "used", "open_box", "good"]);

export const product = p.pgTable("PRODUCT", {
  id: p.uuid().primaryKey().notNull().defaultRandom(),
  slug: p.text().notNull().unique(),
  title: p.text().notNull().default(""),
  content: p.text().notNull().default(""),
  conditon: condition().default("new").notNull(),
  rating: p.numeric({ mode: "number", precision: 4, scale: 3 }).default(0),
  active: p.boolean().default(true),
  ...timestamps,
});

export const currency = p.pgTable("CURRENCY", {
  title: p.text().notNull().primaryKey().unique(),
  ...timestamps,
});

export const unit = p.pgTable("UNIT", {
  title: p.text().notNull().primaryKey().unique(),
  ...timestamps,
});

export const product_variant = p.pgTable("PRODUCT_VARIANT", {
  id: p.uuid().primaryKey().notNull().defaultRandom(),
  sku: p.text().unique().notNull(),
  bar_code: p.text().unique().notNull(),

  // Pricing
  price_in_minor_units: p.integer().notNull().default(0),
  old_price_in_minor_units: p.integer(),
  pricing_calc_by: p
    .text()
    // .notNull()
    // .default("uzs")
    .references(() => currency.title, restrictDeleteUpdateRelations),

  // Stock
  quantity: p.numeric({ precision: 20, scale: 6 }).notNull().default("0"),
  unit: p
    .text()
    // .notNull()
    // .default("piece")
    .references(() => unit.title, restrictDeleteUpdateRelations),

  active: p.boolean().default(true),
  product_id: p
    .uuid()
    .notNull()
    .references(() => product.id, restrictDeleteUpdateRelations),
  ...timestamps,
});

export const attribute = p.pgTable("ATTRIBUTE", {
  id: p.uuid().primaryKey().notNull().defaultRandom(),
  title: p.text().notNull(),
  ...timestamps,
});

export const attribute_value = p.pgTable("ATTRIBUTE_VALUE", {
  id: p.uuid().primaryKey().notNull().defaultRandom(),
  title: p.text().notNull(),
  attribute_id: p.uuid().references(() => attribute.id, restrictDeleteUpdateRelations),
});

export const product_variant_attribute_value = p.pgTable(
  "PRODUCT_VARIANT_ATTRIBUTE_VALUE",
  {
    product_variant_id: p
      .uuid()
      .notNull()
      .references(() => product_variant.id, restrictDeleteUpdateRelations),
    attribute_value_id: p
      .uuid()
      .notNull()
      .references(() => attribute_value.id, restrictDeleteUpdateRelations),
  },
  (table) => [
    p.primaryKey({ columns: [table.attribute_value_id, table.product_variant_id] }),
    //
  ]
);

export const productRelations = relations(product, ({ many }) => ({
  product_variants: many(product_variant),
}));

export const productVariantRelations = relations(product_variant, ({ one, many }) => ({
  product: one(product, {
    fields: [product_variant.product_id],
    references: [product.id],
  }),
  product_variant_attribute_values: many(product_variant_attribute_value),
}));

export const attributeRelations = relations(attribute, ({ many }) => ({
  attribute_values: many(attribute_value),
}));

export const attributeValueRelations = relations(attribute_value, ({ one, many }) => ({
  attribute: one(attribute, {
    fields: [attribute_value.attribute_id],
    references: [attribute.id],
  }),
  product_variant_attribute_values: many(product_variant_attribute_value),
}));

export const productVariantAttributeValueRelations = relations(product_variant_attribute_value, ({ one }) => ({
  product_variant: one(product_variant, {
    fields: [product_variant_attribute_value.product_variant_id],
    references: [product_variant.id],
  }),
  attribute_value: one(attribute_value, {
    fields: [product_variant_attribute_value.attribute_value_id],
    references: [attribute_value.id],
  }),
}));

export const productVariantCurrencyRelations = relations(product_variant, ({ one }) => {
  return {
    currency: one(currency, {
      fields: [product_variant.pricing_calc_by],
      references: [currency.title],
    }),
    unit: one(unit, {
      fields: [product_variant.unit],
      references: [unit.title],
    }),
  };
});
