const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
} = require('../controllers/facture.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Factures
 *   description: Gestion des factures
 */

/**
 * @swagger
 * /factures:
 *   get:
 *     summary: Liste des factures
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [PAYEE, EN_ATTENTE, EN_RETARD, ANNULEE] }
 *       - in: query
 *         name: formationId
 *         schema: { type: integer }
 *       - in: query
 *         name: sessionId
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des factures
 */
router.get('/', authMiddleware, rbacMiddleware('admin'), getFactures);

/**
 * @swagger
 * /factures/{id}:
 *   get:
 *     summary: Détail d'une facture
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail de la facture
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isString()],
  validate,
  getFactureById
);

/**
 * @swagger
 * /factures:
 *   post:
 *     summary: Créer une facture
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client, formationId, montant, date]
 *             properties:
 *               client: { type: string }
 *               formationId: { type: integer }
 *               sessionId: { type: integer }
 *               montant: { type: number }
 *               tva: { type: number }
 *               date: { type: string, format: date }
 *               statut: { type: string, enum: [PAYEE, EN_ATTENTE, EN_RETARD, ANNULEE] }
 *               datePaiement: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Facture créée
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    body('client').isString().notEmpty(),
    body('formationId').isInt(),
    body('sessionId').optional({ nullable: true }).isInt(),
    body('montant').isDecimal(),
    body('tva').optional().isDecimal(),
    body('date').isISO8601(),
    body('statut').optional().isIn(['PAYEE', 'EN_ATTENTE', 'EN_RETARD', 'ANNULEE']),
    body('datePaiement').optional().isISO8601(),
  ],
  validate,
  createFacture
);

/**
 * @swagger
 * /factures/{id}:
 *   put:
 *     summary: Mettre à jour une facture
 *     tags: [Factures]
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
 *               client: { type: string }
 *               montant: { type: number }
 *               tva: { type: number }
 *               statut: { type: string, enum: [PAYEE, EN_ATTENTE, EN_RETARD, ANNULEE] }
 *               datePaiement: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Facture mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    param('id').isString(),
    body('client').optional().isString(),
    body('montant').optional().isDecimal(),
    body('tva').optional().isDecimal(),
    body('statut').optional().isIn(['PAYEE', 'EN_ATTENTE', 'EN_RETARD', 'ANNULEE']),
    body('datePaiement').optional().isISO8601(),
  ],
  validate,
  updateFacture
);

/**
 * @swagger
 * /factures/{id}:
 *   delete:
 *     summary: Supprimer une facture
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Facture supprimée
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isString()],
  validate,
  deleteFacture
);

module.exports = router;
