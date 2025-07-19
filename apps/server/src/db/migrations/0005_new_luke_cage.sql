-- Up migration: set default to 0
-- ALTER TABLE "PRODUCT_VARIANT" ALTER COLUMN "price_in_minor_units" SET DEFAULT 0;

-- Down migration: remove default
-- Uncomment the following line if you need to revert
-- ALTER TABLE "PRODUCT_VARIANT" ALTER COLUMN "price_in_minor_units" DROP DEFAULT;