ALTER TABLE "CATEGORY" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "CATEGORY" RENAME COLUMN "updateAt" TO "update_at";--> statement-breakpoint
ALTER TABLE "ATTRIBUTE" RENAME COLUMN "updateAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "ATTRIBUTE" RENAME COLUMN "createdAt" TO "update_at";--> statement-breakpoint
ALTER TABLE "PRODUCT" RENAME COLUMN "updateAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "PRODUCT" RENAME COLUMN "createdAt" TO "update_at";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "PRODUCT_VARIANT" RENAME COLUMN "updateAt" TO "update_at";--> statement-breakpoint
ALTER TABLE "USERS" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "USERS" RENAME COLUMN "updateAt" TO "update_at";