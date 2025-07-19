CREATE TABLE "CURRENCY" (
	"title" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "CURRENCY_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "UNIT" (
	"title" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "UNIT_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "CATEGORY" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "ATTRIBUTE" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "PRODUCT" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "USERS" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ALTER COLUMN "pricing_calc_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ALTER COLUMN "pricing_calc_by" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "CATEGORY" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ADD COLUMN "price_in_minor_units" integer NOT NULL DEFAULT 0;
ALTER TABLE "PRODUCT_VARIANT" ADD COLUMN "old_price_in_minor_units" integer;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ADD COLUMN "quantity" numeric(20, 6) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ADD COLUMN "unit" text;--> statement-breakpoint

ALTER TABLE "CATEGORY" ADD CONSTRAINT "CATEGORY_parent_id_CATEGORY_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."CATEGORY"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ADD CONSTRAINT "PRODUCT_VARIANT_pricing_calc_by_CURRENCY_title_fk" FOREIGN KEY ("pricing_calc_by") REFERENCES "public"."CURRENCY"("title") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ADD CONSTRAINT "PRODUCT_VARIANT_unit_UNIT_title_fk" FOREIGN KEY ("unit") REFERENCES "public"."UNIT"("title") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint

ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "price_in_tiyin";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "price_in_cents";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "old_price_in_tiyin";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "old_price_in_cents";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" DROP COLUMN "amount";--> statement-breakpoint
DROP TYPE "public"."ENUM_PRICING_CALC_BY";