import "dotenv/config";
import { db } from "..";
import { attribute, attribute_value, condition, product, product_variant, product_variant_attribute_value } from "../models/products.model";

async function removeAttributesReferences() {
  await db.delete(product_variant_attribute_value).execute();
  await db.delete(attribute_value).execute();
  await db.delete(attribute).execute();
}

async function removeProductsReferences() {
  await db.delete(product_variant).execute();
  await db.delete(product).execute();
}

async function main() {
  await removeAttributesReferences();
  console.log("🔴 All attributes ref removed");
  await removeProductsReferences();
  console.log("🔴 All product ref removed");
}

main();
