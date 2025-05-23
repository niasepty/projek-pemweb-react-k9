-- CreateTable
CREATE TABLE `Collection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animeMalId` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Collection_userEmail_animeMalId_key`(`userEmail`, `animeMalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
