/*
  Warnings:

  - Added the required column `address` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `phone` VARCHAR(20) NOT NULL,
    ADD COLUMN `profile_picture` VARCHAR(191) NULL DEFAULT '../src/assets/img/avatar.webp';
