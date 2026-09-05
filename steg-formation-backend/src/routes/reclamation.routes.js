const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getReclamations,
  getReclamationById,
  createReclamation,
  updateReclamation,
  deleteReclamation,
} = require('../controllers/reclamation.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Reclamations
 *   description: Gestion des réclamations
 */

/**
 * @swagger
 * /reclamations:
 *   get:
 *     summary: Liste des réclamations
 *     tags: [Reclamations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [LOGISTIQUE, PEDAGOGIE, RESTAURATION, AUTRE] }
 *       - in: query
 *         name: priorite
 *         schema: { type: string, enum: [HAUTE, MOYENNE, BASSE] }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [OUVERT, EN_COURS, RESOLU, CLOS] }
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
 *         description: Liste des réclamations
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getReclamations);

/**
 * @swagger
 * /reclamations/{id}:
 *   get:
 *     summary: Détail d'une réclamation
 *     tags: [Reclamations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail de la réclamation
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur', 'participant'),
  [param('id').isString().notEmpty().isLength({ max: 20 })],
  validate,
  getReclamationById
);

/**
 * @swagger
 * /reclamations:
 *   post:
 *     summary: Créer une réclamation
 *     tags: [Reclamations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [participantId, formationId, type, priorite, description, date]
 *             properties:
 *               participantId: { type: integer }
 *               formationId: { type: integer }
 *               sessionId: { type: integer }
 *               type: { type: string, enum: [LOGISTIQUE, PEDAGOGIE, RESTAURATION, AUTRE] }
 *               priorite: { type: string, enum: [HAUTE, MOYENNE, BASSE] }
 *               titre: { type: string }
 *               description: { type: string }
 *               centre: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Réclamation créée
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin', 'participant'),
  [
    body('participantId').isInt(),
    body('formationId').isInt(),
    body('sessionId').optional({ nullable: true }).isInt(),
    body('type').isIn(['LOGISTIQUE', 'PEDAGOGIE', 'RESTAURATION', 'AUTRE']),
    body('priorite').isIn(['HAUTE', 'MOYENNE', 'BASSE']),
    body('titre').optional().isString(),
    body('description').isString().notEmpty(),
    body('centre').optional().isString(),
    body('date').isISO8601(),
  ],
  validate,
  createReclamation
);

/**
 * @swagger
 * /reclamations/{id}:
 *   put:
 *     summary: Mettre à jour une réclamation
 *     tags: [Reclamations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut: { type: string, enum: [OUVERT, EN_COURS, RESOLU, CLOS] }
 *               priorite: { type: string, enum: [HAUTE, MOYENNE, BASSE] }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Réclamation mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    param('id').isString().notEmpty().isLength({ max: 20 }),
    body('statut').optional().isIn(['OUVERT', 'EN_COURS', 'RESOLU', 'CLOS']),
    body('priorite').optional().isIn(['HAUTE', 'MOYENNE', 'BASSE']),
    body('description').optional().isString().notEmpty(),
  ],
  validate,
  updateReclamation
);

/**
 * @swagger
 * /reclamations/{id}:
 *   delete:
 *     summary: Supprimer une réclamation
 *     tags: [Reclamations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Réclamation supprimée
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isString().notEmpty().isLength({ max: 20 })],
  validate,
  deleteReclamation
);

module.exports = router;
