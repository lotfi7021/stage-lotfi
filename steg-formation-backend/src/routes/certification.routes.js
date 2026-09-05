const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certification.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Certifications
 *   description: Gestion des certifications
 */

/**
 * @swagger
 * /certifications:
 *   get:
 *     summary: Liste des certifications
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [VALIDE, EXPIRE, RENOUVELLEMENT] }
 *       - in: query
 *         name: formationId
 *         schema: { type: integer }
 *       - in: query
 *         name: participantId
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des certifications
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getCertifications);

/**
 * @swagger
 * /certifications/{id}:
 *   get:
 *     summary: Détail d'une certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détail de la certification
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur', 'participant'),
  [param('id').isInt()],
  validate,
  getCertificationById
);

/**
 * @swagger
 * /certifications:
 *   post:
 *     summary: Créer une certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [participantId, formationId, sessionId, dateEmission]
 *             properties:
 *               participantId: { type: integer }
 *               formationId: { type: integer }
 *               sessionId: { type: integer }
 *               dateEmission: { type: string, format: date }
 *               dateExpiration: { type: string, format: date }
 *               qrCode: { type: string }
 *     responses:
 *       201:
 *         description: Certification créée
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('formateur'),
  [
    body('participantId').isInt(),
    body('formationId').isInt(),
    body('sessionId').isInt(),
    body('dateEmission').isISO8601(),
    body('dateExpiration').optional().isISO8601(),
    body('qrCode').optional().isString(),
  ],
  validate,
  createCertification
);

/**
 * @swagger
 * /certifications/{id}:
 *   put:
 *     summary: Mettre à jour une certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut: { type: string, enum: [VALIDE, EXPIRE, RENOUVELLEMENT] }
 *               dateExpiration: { type: string, format: date }
 *               qrCode: { type: string }
 *     responses:
 *       200:
 *         description: Certification mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    param('id').isInt(),
    body('statut').optional().isIn(['VALIDE', 'EXPIRE', 'RENOUVELLEMENT']),
    body('dateExpiration').optional().isISO8601(),
    body('qrCode').optional().isString(),
  ],
  validate,
  updateCertification
);

/**
 * @swagger
 * /certifications/{id}:
 *   delete:
 *     summary: Supprimer une certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Certification supprimée
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteCertification
);

module.exports = router;
