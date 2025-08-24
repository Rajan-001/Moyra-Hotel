/*
  Warnings:

  - You are about to drop the `_PaymentsToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_PaymentsToUser" DROP CONSTRAINT "_PaymentsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PaymentsToUser" DROP CONSTRAINT "_PaymentsToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."Payments" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_PaymentsToUser";

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
