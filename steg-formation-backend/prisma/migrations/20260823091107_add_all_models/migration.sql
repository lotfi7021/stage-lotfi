-- DropIndex
DROP INDEX `utilisateurs_role_id_fkey` ON `utilisateurs`;

-- CreateTable
CREATE TABLE `formations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(150) NOT NULL,
    `reference` VARCHAR(30) NOT NULL,
    `categorie` VARCHAR(60) NOT NULL,
    `objectifs` TEXT NULL,
    `prerequis` TEXT NULL,
    `modules` TEXT NULL,
    `duree` VARCHAR(20) NOT NULL,
    `prix` DECIMAL(10, 2) NULL,
    `max_participants` INTEGER NOT NULL,
    `statut` ENUM('PLANNED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `formations_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `formation_id` INTEGER NOT NULL,
    `formateur_id` INTEGER NOT NULL,
    `date_debut` DATE NOT NULL,
    `date_fin` DATE NOT NULL,
    `heure` TIME(0) NULL,
    `lieu` VARCHAR(150) NOT NULL,
    `type` ENUM('INTER', 'INTRA') NOT NULL,
    `statut` ENUM('PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `max_participants` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `date_inscription` DATE NOT NULL,
    `statut` ENUM('ENROLLED', 'CONFIRMED', 'ATTENDED', 'CANCELLED', 'WAITLIST') NOT NULL DEFAULT 'ENROLLED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `inscriptions_session_id_participant_id_key`(`session_id`, `participant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `statut` ENUM('PRESENT', 'ABSENT', 'JUSTIFIED') NOT NULL,
    `note` VARCHAR(255) NULL,
    `cantine` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `presences_session_id_participant_id_date_key`(`session_id`, `participant_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `type` ENUM('PRE', 'POST', 'SATISFACTION') NOT NULL,
    `score` DECIMAL(4, 2) NULL,
    `commentaire` TEXT NULL,
    `date` DATE NOT NULL,
    `statut` ENUM('OPEN', 'SUBMITTED', 'VALIDATED') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(30) NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `formation_id` INTEGER NOT NULL,
    `session_id` INTEGER NOT NULL,
    `date_emission` DATE NOT NULL,
    `date_expiration` DATE NULL,
    `statut` ENUM('VALIDE', 'EXPIRE', 'RENOUVELLEMENT') NOT NULL DEFAULT 'VALIDE',
    `qrCode` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `certifications_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reclamations` (
    `id` VARCHAR(20) NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `formation_id` INTEGER NOT NULL,
    `session_id` INTEGER NULL,
    `type` ENUM('LOGISTIQUE', 'PEDAGOGIE', 'RESTAURATION', 'AUTRE') NOT NULL,
    `priorite` ENUM('HAUTE', 'MOYENNE', 'BASSE') NOT NULL,
    `titre` VARCHAR(150) NULL,
    `description` TEXT NOT NULL,
    `centre` VARCHAR(100) NULL,
    `date` DATE NOT NULL,
    `statut` ENUM('OUVERT', 'EN_COURS', 'RESOLU', 'CLOS') NOT NULL DEFAULT 'OUVERT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factures` (
    `id` VARCHAR(20) NOT NULL,
    `client` VARCHAR(150) NOT NULL,
    `formation_id` INTEGER NOT NULL,
    `session_id` INTEGER NULL,
    `montant` DECIMAL(12, 2) NOT NULL,
    `tva` DECIMAL(5, 2) NULL,
    `date` DATE NOT NULL,
    `statut` ENUM('PAYEE', 'EN_ATTENTE', 'EN_RETARD', 'ANNULEE') NOT NULL DEFAULT 'EN_ATTENTE',
    `date_paiement` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supports_formation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `chemin` VARCHAR(255) NOT NULL,
    `categorie` VARCHAR(60) NULL,
    `type` VARCHAR(20) NULL,
    `taille` VARCHAR(20) NULL,
    `statut` ENUM('VALIDE', 'EN_ATTENTE') NOT NULL DEFAULT 'EN_ATTENTE',
    `uploader_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `utilisateurs` ADD CONSTRAINT `utilisateurs_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `formateurs` ADD CONSTRAINT `formateurs_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_formation_id_fkey` FOREIGN KEY (`formation_id`) REFERENCES `formations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_formateur_id_fkey` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscriptions` ADD CONSTRAINT `inscriptions_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscriptions` ADD CONSTRAINT `inscriptions_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presences` ADD CONSTRAINT `presences_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presences` ADD CONSTRAINT `presences_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_formation_id_fkey` FOREIGN KEY (`formation_id`) REFERENCES `formations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reclamations` ADD CONSTRAINT `reclamations_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reclamations` ADD CONSTRAINT `reclamations_formation_id_fkey` FOREIGN KEY (`formation_id`) REFERENCES `formations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reclamations` ADD CONSTRAINT `reclamations_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factures` ADD CONSTRAINT `factures_formation_id_fkey` FOREIGN KEY (`formation_id`) REFERENCES `formations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factures` ADD CONSTRAINT `factures_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supports_formation` ADD CONSTRAINT `supports_formation_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supports_formation` ADD CONSTRAINT `supports_formation_uploader_id_fkey` FOREIGN KEY (`uploader_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
