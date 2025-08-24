/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'success', 'failed', 'created', 'attempted', 'paid');

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "booking_id" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "receipt" TEXT NOT NULL,
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "time" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpay_payment_id" TEXT NOT NULL,
    "razorpay_signature" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "razorpay_order_id" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PaymentsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PaymentsToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payments_razorpay_payment_id_key" ON "public"."Payments"("razorpay_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_razorpay_order_id_key" ON "public"."Payments"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "_PaymentsToUser_B_index" ON "public"."_PaymentsToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_booking_id_key" ON "public"."Booking"("booking_id");

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Booking"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PaymentsToUser" ADD CONSTRAINT "_PaymentsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PaymentsToUser" ADD CONSTRAINT "_PaymentsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
