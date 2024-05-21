/*
  Warnings:

  - You are about to drop the column `description` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - Added the required column `content` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskNumber` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "taskNumber" TEXT NOT NULL;
