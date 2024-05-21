/*
  Warnings:

  - The primary key for the `AttendeeAttachedTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `AttendeeAttachedTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendeeAttachedTask" DROP CONSTRAINT "AttendeeAttachedTask_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "AttendeeAttachedTask_pkey" PRIMARY KEY ("id");
