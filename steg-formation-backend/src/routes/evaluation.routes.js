const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
} = require('../controllers/evaluation.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Gestion des évaluations
 */

/**
 * @swagger
 * /evaluations:
 *   get:
 *     summary: Liste des évaluations
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [PRE, POST, SATISFACTION] }
 *       - in: query
 *         name: sessionId
 *         schema: { type: integer }
 *       - in: query
 *         name: participantId
 *         schema: { type: integer }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [OPEN, SUBMITTED, VALIDATED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des évaluations
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getEvaluations);

/**
 * @swagger
 * /evaluations/{id}:
 *   get:
 *     summary: Détail d'une évaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détail de l'évaluation
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  [param('id').isInt()],
  validate,
  getEvaluationById
);

/**
 * @swagger
 * /evaluations:
 *   post:
 *     summary: Créer une évaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, participantId, type, date]
 *             properties:
 *               sessionId: { type: integer }
 *               participantId: { type: integer }
 *               type: { type: string, enum: [PRE, POST, SATISFACTION] }
 *               score: { type: number }
 *               commentaire: { type: string }
 *               date: { type: string, format: date }
 *               statut: { type: string, enum: [OPEN, SUBMITTED, VALIDATED] }
 *     responses:
 *       201:
 *         description: Évaluation créée
 *       404:
 *         description: Session ou participant introuvable
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    body('sessionId').isInt(),
    body('participantId').isInt(),
    body('type').isIn(['PRE', 'POST', 'SATISFACTION']),
    body('score').optional().isDecimal(),
    body('commentaire').optional().isString(),
    body('date').isISO8601(),
    body('statut').optional().isIn(['OPEN', 'SUBMITTED', 'VALIDATED']),
  ],
  validate,
  createEvaluation
);

/**
 * @swagger
 * /evaluations/{id}:
 *   put:
 *     summary: Mettre à jour une évaluation
 *     tags: [Evaluations]
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
 *               score: { type: number }
 *               commentaire: { type: string }
 *               statut: { type: string, enum: [OPEN, SUBMITTED, VALIDATED] }
 *     responses:
 *       200:
 *         description: Évaluation mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    param('id').isInt(),
    body('score').optional().isDecimal(),
    body('commentaire').optional().isString(),
    body('statut').optional().isIn(['OPEN', 'SUBMITTED', 'VALIDATED']),
  ],
  validate,
  updateEvaluation
);

/**
 * @swagger
 * /evaluations/{id}:
 *   delete:
 *     summary: Supprimer une évaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Évaluation supprimée
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteEvaluation
);

module.exports = router;
