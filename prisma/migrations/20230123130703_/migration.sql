/*
  Warnings:

  - You are about to alter the column `priority` on the `media_in_post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `media_in_post` MODIFY `priority` INTEGER NOT NULL;
