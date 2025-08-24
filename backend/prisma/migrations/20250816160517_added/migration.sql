/*
  Warnings:

  - Made the column `amount` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "amount" SET NOT NULL;
