import { db } from "#/db";
import { attribute, attribute_value, product, product_variant, product_variant_attribute_value } from "#/db/models/products.model";
import { eq, inArray } from "drizzle-orm";
import type { Request, Response } from "express";

const $_KURS = 12800;

class ProductController {
  constructor() {}

  public async list(_req: Request, res: Response) {
    const products = await db.query.product.findMany({
      limit: 10,
      with: {
        product_variants: {
          with: {
            product_variant_attribute_values: {
              columns: {
                attribute_value_id: true,
              },
              with: {
                attribute_value: true,
              },
            },
          },
        },
      },
    });

    res.json(products);
  }

  public async getById(_req: Request, res: Response) {
    const id = "17837088-ca4a-4537-a746-aa7a042a4a01";

    const productById = await db.query.product.findFirst({
      // where: eq(product.id, id),
      with: {
        product_variants: {
          with: {
            product_variant_attribute_values: {
              columns: {
                attribute_value_id: true,
              },
              with: {
                attribute_value: true,
              },
            },
          },
        },
      },
    });

    // not found
    if (!productById) {
      res.status(404).json({ msg: "error" });
      return;
    }

    // Get all avaiable attributes for this specific product, with attribute values:
    // Color: Red, White, Brown
    const attrIds = productById.product_variants.reduce(
      (acc, curr) => {
        curr.product_variant_attribute_values.forEach((product_variant_attribute_value) => {
          const attribute_id = product_variant_attribute_value.attribute_value.attribute_id;
          const attribute_value_id = product_variant_attribute_value.attribute_value.id;

          if (attribute_id && !acc.attributeIds[attribute_id]) {
            acc.attributeIds[attribute_id] = true;
          }

          if (attribute_value_id && !acc.attributeValueIds[attribute_value_id]) {
            acc.attributeValueIds[attribute_value_id] = true;
          }
        });

        return acc;
      },
      { attributeIds: {}, attributeValueIds: {} } as { attributeIds: Record<string, true>; attributeValueIds: Record<string, true> }
    );

    const attributes = await db.query.attribute.findMany({
      where: inArray(attribute.id, Object.keys(attrIds.attributeIds)),
      columns: {
        id: true,
        title: true,
      },
      with: {
        attribute_values: {
          where: inArray(attribute_value.id, Object.keys(attrIds.attributeValueIds)),
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json({
      attributes,
      product: productById,
    });
  }

  public async add(_req: Request, res: Response) {
    try {
      const isVariative = false;

      if (isVariative) {
        const validatedProductData: typeof product.$inferInsert = {
          slug: "iphone-16-pro", // _req.body.title.toLowerCase(),
          title: "Iphone 16 pro", // _req.body.title,
          conditon: "new", // _req.body.condition,
          active: true, // _req.body.active,
          content: "Apple iphone 16 pro in a brand new condition", // _req.body.content,
        };

        await db.transaction(async (tx) => {
          const [insertedProduct] = await tx.insert(product).values(validatedProductData).returning();

          // Iphone 16 pro
          // Black Blue
          // 128gb 256gb

          // Black 128gb - 12 000 000 - 10x

          // BLUE  - 6c326ca8-2f11-4774-898a-40e07961d4f7
          // BLACK - 743f7a9a-f1cc-4459-a412-d8aca79f46bc
          // 128gb - 3d2834f3-fdd3-41e3-8fa4-09863f9ec67d
          // 256gb - 53167199-65d7-4a30-ae57-0478efe2b5d5

          // Blue 128gb  - 12 000 000 - 10x
          // Black 256gb  - 13 500 000 - 10x
          // Blue 256gb  - 13 000 000 - 3x

          const validatedVariativeProducts: (
            newProduct: typeof product.$inferSelect
          ) => ({ product_variant_attribute_values: string[] } & typeof product_variant.$inferInsert)[] = (newProduct) => {
            return [
              {
                product_id: newProduct.id,
                bar_code: "BAR-BLACK-128gb",
                sku: "SKU-BLACK-128gb",
                amount: 10,
                active: true,
                price_in_tiyin: 12000000 * 100,
                price_in_cents: Math.trunc((12000000 * 100) / $_KURS),
                old_price_in_cents: 0,
                old_price_in_tiyin: 0,
                pricing_calc_by: "uzs",
                product_variant_attribute_values: ["743f7a9a-f1cc-4459-a412-d8aca79f46bc", "3d2834f3-fdd3-41e3-8fa4-09863f9ec67d"],
              },
              {
                product_id: newProduct.id,
                bar_code: "BAR-BLACK-256gb",
                sku: "SKU-BLACK-256gb",
                amount: 10,
                active: true,
                price_in_tiyin: 13500000 * 100,
                price_in_cents: Math.trunc((13500000 * 100) / $_KURS),
                old_price_in_cents: 0,
                old_price_in_tiyin: 0,
                pricing_calc_by: "uzs",
                product_variant_attribute_values: ["743f7a9a-f1cc-4459-a412-d8aca79f46bc", "53167199-65d7-4a30-ae57-0478efe2b5d5"],
              },
              {
                product_id: newProduct.id,
                bar_code: "BAR-BLUE-128gb",
                sku: "SKU-BLUE-128gb",
                amount: 10,
                active: true,
                price_in_tiyin: 12000000 * 100,
                price_in_cents: Math.trunc((12000000 * 100) / $_KURS),
                old_price_in_cents: 0,
                old_price_in_tiyin: 0,
                pricing_calc_by: "uzs",
                product_variant_attribute_values: ["6c326ca8-2f11-4774-898a-40e07961d4f7", "3d2834f3-fdd3-41e3-8fa4-09863f9ec67d"],
              },
              {
                product_id: newProduct.id,
                bar_code: "BAR-BLUE-256gb",
                sku: "SKU-BLUE-256gb",
                amount: 3,
                active: true,
                price_in_tiyin: 13000000 * 100,
                price_in_cents: Math.trunc((13000000 * 100) / $_KURS),
                old_price_in_cents: 0,
                old_price_in_tiyin: 0,
                pricing_calc_by: "uzs",
                product_variant_attribute_values: ["6c326ca8-2f11-4774-898a-40e07961d4f7", "53167199-65d7-4a30-ae57-0478efe2b5d5"],
              },
            ];
          };

          for (let pvToInsert of validatedVariativeProducts(insertedProduct)) {
            const { product_variant_attribute_values, ...variantData } = pvToInsert;
            const [insertedProductVariant] = await tx.insert(product_variant).values(variantData).returning();

            await tx.insert(product_variant_attribute_value).values(
              product_variant_attribute_values.map((attribute_value_id) => {
                return {
                  attribute_value_id: attribute_value_id,
                  product_variant_id: insertedProductVariant.id,
                };
              })
            );
          }
        });

        res.json({ success: true });
      } else {
        const validatedProductData: typeof product.$inferInsert = {
          slug: "macbook-pro-i7", // _req.body.title.toLowerCase(),
          title: "Macbook pro 16inch i7 gen. (2019)", // _req.body.title,
          conditon: "used", // _req.body.condition,
          active: true, // _req.body.active,
          content: "Used Macbook Pro 2019 intel i7 chip, with good condition", // _req.body.content,
        };

        await db.transaction(async (tx) => {
          const [insertedProduct] = await tx.insert(product).values(validatedProductData).returning();

          // Macbook intel i7 old - $450

          const validatedVariativeProducts: (newProduct: typeof product.$inferSelect) => typeof product_variant.$inferInsert = (newProduct) => {
            return {
              product_id: newProduct.id,
              bar_code: "mcpro-i7-001",
              sku: "MC-PI7-001",
              amount: 1,
              active: true,
              price_in_tiyin: Math.trunc(450 * 12700 * 100),
              price_in_cents: 450 * 100,
              old_price_in_cents: 0,
              old_price_in_tiyin: 0,
              pricing_calc_by: "usd",
            };
          };

          const [insertedProductVariant] = await tx.insert(product_variant).values(validatedVariativeProducts(insertedProduct)).returning();

          return insertedProductVariant;
        });

        res.json({ success: true, msg: "non-variative created" });
      }
    } catch (error) {
      console.log("---------------------------------------------------", error, "---------------------------------------------------");
      res.end(error);
    }
  }
}

export default new ProductController();
