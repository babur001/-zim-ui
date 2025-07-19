import "dotenv/config";
import { db } from "..";
import { attribute, attribute_value, condition, product, product_variant, product_variant_attribute_value } from "../models/products.model";

const ATTRIBUTES_WITH_VALUES = [
  {
    title: "SIZE",
    values: ["100g", "300g"],
  },
  {
    title: "COLOR",
    values: ["GREEN", "YELLOW", "BLUE", "ORANGE", "RED"],
  },
];

async function seedAttributes() {
  const attributeMap = new Map<string, { id: string; values: { id: string; title: string }[] }>();

  for (const attr of ATTRIBUTES_WITH_VALUES) {
    const [insertedAttr] = await db.insert(attribute).values({ title: attr.title }).returning();

    const insertedValues = await Promise.all(
      attr.values.map(async (val) => {
        const [insertedVal] = await db.insert(attribute_value).values({ title: val, attribute_id: insertedAttr.id }).returning();
        return insertedVal;
      })
    );

    attributeMap.set(attr.title, { id: insertedAttr.id, values: insertedValues });
  }

  return attributeMap;
}

async function seedProductWithVariants(attributeMap: Map<string, any>) {
  const [newProduct] = await db
    .insert(product)
    .values({
      title: "Merci Plitka",
      slug: "merci-plitka-chocolate",
      content: "Merci plitka chocolate with unearthy taste!",
      conditon: "new",
    })
    .returning();

  const colors = attributeMap.get("COLOR").values ?? [];
  const sizes = attributeMap.get("SIZE").values ?? [];

  let i = 0;
  // Generate all combinations of color × size
  for (const size of sizes) {
    for (const color of colors) {
      const sku = `SKU-${color.title}-${size.title}`.toUpperCase();
      const bar_code = `BAR-${color.title}-${size.title}`.toUpperCase();

      const [new_merci_variant] = await db
        .insert(product_variant)
        .values({
          product_id: newProduct.id,
          sku,
          bar_code,
          price_in_minor_units: (i === 0 ? 35000 : 140000) * 100,
          old_price_in_minor_units: null,
          quantity: String(i === 0 ? 12 : color.title === "RED" ? 7 : 0),
        })
        .returning();

      // Link this variant to its attribute values
      await db.insert(product_variant_attribute_value).values([
        {
          product_variant_id: new_merci_variant.id,
          attribute_value_id: color.id,
        },
        {
          product_variant_id: new_merci_variant.id,
          attribute_value_id: size.id,
        },
      ]);
    }
    i += 1;
  }
}

async function main() {
  const attributeMap = await seedAttributes();
  console.log("✅ Attributes seeded");

  await seedProductWithVariants(attributeMap);
  console.log("✅ Product and variants seeded");
}

main();
