const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getPresences,
  getPresenceById,
  getPresencesBySession,
  upsertPresence,
  bulkCreatePresences,
  updatePresence,
  deletePresence,
} = require('../controllers/presence.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Presences
 *   description: Gestion des présences aux sessions de formation
 */

/**
 * @swagger
 * /presences:
 *   get:
 *     summary: Liste des présences
 *     tags: [Presences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [PRESENT, ABSENT, JUSTIFIED] }
 *       - in: query
 *         name: sessionId
 *         schema: { type: integer }
 *       - in: query
 *         name: participantId
 *         schema: { type: integer }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des présences
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getPresences);

/**
 * @swagger
 * /presences/session/{sessionId}:
 *   get:
 *     summary: Présences d'une session
 *     tags: [Presences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Présences de la session avec statistiques
 */
router.get('/session/:sessionId', authMiddleware, rbacMiddleware('admin', 'formateur'), getPresencesBySession);

/**
 * @swagger
 * /presences/{id}:
 *   get:
 *     summary: Détail d'une présence
 *     tags: [Presences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détail de la présence
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  [param('id').isInt()],
  validate,
  getPresenceById
);

/**
 * @swagger
 * /presences:
 *   post:
 *     summary: Créer ou mettre à jour une présence (upsert)
 *     tags: [Presences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, participantId, date, statut]
 *             properties:
 *               sessionId: { type: integer }
 *               participantId: { type: integer }
 *               date: { type: string, format: date }
 *               statut: { type: string, enum: [PRESENT, ABSENT, JUSTIFIED] }
 *               note: { type: string }
 *               cantine: { type: boolean }
 *     responses:
 *       201:
 *         description: Présence enregistrée
 *       400:
 *         description: Participant non inscrit
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
    body('date').isISO8601(),
    body('statut').isIn(['PRESENT', 'ABSENT', 'JUSTIFIED']),
    body('note').optional().isString(),
    body('cantine').optional().isBoolean(),
  ],
  validate,
  upsertPresence
);

/**
 * @swagger
 * /presences/bulk:
 *   post:
 *     summary: Enregistrer les présences en masse pour une session
 *     tags: [Presences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, date, presences]
 *             properties:
 *               sessionId: { type: integer }
 *               date: { type: string, format: date }
 *               presences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [participantId, statut]
 *                   properties:
 *                     participantId: { type: integer }
 *                     statut: { type: string, enum: [PRESENT, ABSENT, JUSTIFIED] }
 *                     note: { type: string }
 *                     cantine: { type: boolean }
 *     responses:
 *       201:
 *         description: Présences enregistrées
 */
router.post(
  '/bulk',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    body('sessionId').isInt(),
    body('date').isISO8601(),
    body('presences').isArray({ min: 1 }),
    body('presences.*.participantId').isInt(),
    body('presences.*.statut').isIn(['PRESENT', 'ABSENT', 'JUSTIFIED']),
    body('presences.*.note').optional().isString(),
    body('presences.*.cantine').optional().isBoolean(),
  ],
  validate,
  bulkCreatePresences
);

/**
 * @swagger
 * /presences/{id}:
 *   put:
 *     summary: Mettre à jour une présence
 *     tags: [Presences]
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
 *               statut: { type: string, enum: [PRESENT, ABSENT, JUSTIFIED] }
 *               note: { type: string }
 *               cantine: { type: boolean }
 *     responses:
 *       200:
 *         description: Présence mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    param('id').isInt(),
    body('statut').optional().isIn(['PRESENT', 'ABSENT', 'JUSTIFIED']),
    body('note').optional().isString(),
    body('cantine').optional().isBoolean(),
  ],
  validate,
  updatePresence
);

/**
 * @swagger
 * /presences/{id}:
 *   delete:
 *     summary: Supprimer une présence
 *     tags: [Presences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Présence supprimée
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deletePresence
);

module.exports = router;
