-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cars` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `cars_postId_key`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prices` (
    `id` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `prices_carId_key`(`carId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specifications` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `body_type` VARCHAR(191) NOT NULL,
    `mileage` VARCHAR(191) NOT NULL,
    `drivetrain` VARCHAR(191) NOT NULL,
    `engine` VARCHAR(191) NOT NULL,
    `transmission` VARCHAR(191) NOT NULL,
    `fuel_type` VARCHAR(191) NOT NULL,
    `exterior_color` VARCHAR(191) NOT NULL,
    `interior_color` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `specifications_carId_key`(`carId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `cars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `specifications` ADD CONSTRAINT `specifications_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `cars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
