/*
  Warnings:

  - A unique constraint covering the columns `[cursor]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cursor` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `cursor` VARCHAR(32) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `posts_cursor_key` ON `posts`(`cursor`);
