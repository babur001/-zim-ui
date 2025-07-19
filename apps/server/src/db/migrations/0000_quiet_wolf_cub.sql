CREATE TYPE "public"."ENUM_CONDITION" AS ENUM('new', 'old', 'used', 'open_box', 'good');--> statement-breakpoint
CREATE TYPE "public"."ENUM_PRICING_CALC_BY" AS ENUM('uzs', 'usd');--> statement-breakpoint
CREATE TABLE "CATEGORY" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" uuid NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateAt" timestamp with time zone,
	CONSTRAINT "CATEGORY_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ATTRIBUTE" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ATTRIBUTE_VALUE" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"attribute_id" uuid
);
--> statement-breakpoint
CREATE TABLE "PRODUCT" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" uuid NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"conditon" "ENUM_CONDITION" DEFAULT 'new' NOT NULL,
	"rating" numeric(4, 3),
	"active" boolean DEFAULT true,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateAt" timestamp with time zone,
	CONSTRAINT "PRODUCT_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "PRODUCT_VARIANT" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text NOT NULL,
	"bar_code" text NOT NULL,
	"price_in_tiyin" integer NOT NULL,
	"price_in_cents" integer NOT NULL,
	"old_price_in_tiyin" integer NOT NULL,
	"old_price_in_cents" integer NOT NULL,
	"pricing_calc_by" "ENUM_PRICING_CALC_BY" DEFAULT 'uzs',
	"amount" integer,
	"active" boolean DEFAULT true,
	"product_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateAt" timestamp with time zone,
	CONSTRAINT "PRODUCT_VARIANT_sku_unique" UNIQUE("sku"),
	CONSTRAINT "PRODUCT_VARIANT_bar_code_unique" UNIQUE("bar_code")
);
--> statement-breakpoint
CREATE TABLE "PRODUCT_VARIANT_ATTRIBUTE_VALUE" (
	"product_variant_id" uuid NOT NULL,
	"attribute_value_id" uuid NOT NULL,
	CONSTRAINT "PRODUCT_VARIANT_ATTRIBUTE_VALUE_attribute_value_id_product_variant_id_pk" PRIMARY KEY("attribute_value_id","product_variant_id")
);
--> statement-breakpoint
CREATE TABLE "USERS" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(255),
	"email" varchar(255),
	"password" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ATTRIBUTE_VALUE" ADD CONSTRAINT "ATTRIBUTE_VALUE_attribute_id_ATTRIBUTE_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."ATTRIBUTE"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" ADD CONSTRAINT "PRODUCT_VARIANT_product_id_PRODUCT_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."PRODUCT"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT_ATTRIBUTE_VALUE" ADD CONSTRAINT "PRODUCT_VARIANT_ATTRIBUTE_VALUE_product_variant_id_PRODUCT_VARIANT_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."PRODUCT_VARIANT"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT_ATTRIBUTE_VALUE" ADD CONSTRAINT "PRODUCT_VARIANT_ATTRIBUTE_VALUE_attribute_value_id_ATTRIBUTE_VALUE_id_fk" FOREIGN KEY ("attribute_value_id") REFERENCES "public"."ATTRIBUTE_VALUE"("id") ON DELETE restrict ON UPDATE restrict;