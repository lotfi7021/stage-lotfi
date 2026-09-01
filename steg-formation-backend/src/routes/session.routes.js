const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} = require('../controllers/session.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Gestion des sessions de formation
 */

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Liste des sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche sur lieu, titre formation, nom formateur
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED] }
 *         description: Filtre exact par statut
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INTER, INTRA] }
 *         description: Filtre exact par type
 *       - in: query
 *         name: formationId
 *         schema: { type: integer }
 *         description: Filtre par formation
 *       - in: query
 *         name: formateurId
 *         schema: { type: integer }
 *         description: Filtre par formateur
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des sessions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Détail d'une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Session avec formation, formateur et compteurs
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [param('id').isInt()],
  validate,
  getSessionById
);

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Créer une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [formationId, formateurId, dateDebut, dateFin, lieu]
 *             properties:
 *               formationId: { type: integer }
 *               formateurId: { type: integer }
 *               dateDebut: { type: string, format: date }
 *               dateFin: { type: string, format: date }
 *               heure: { type: string, format: time }
 *               lieu: { type: string }
 *               type: { type: string, enum: [INTER, INTRA], default: INTRA }
 *               statut: { type: string, enum: [PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED] }
 *               maxParticipants: { type: integer }
 *     responses:
 *       201:
 *         description: Session créée
 *       404:
 *         description: Formation ou formateur introuvable
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    body('formationId').isInt(),
    body('formateurId').isInt(),
    body('dateDebut').isISO8601(),
    body('dateFin').isISO8601(),
    body('heure').optional().isISO8601(),
    body('lieu').isString().notEmpty(),
    body('statut').optional().isIn(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']),
    body('maxParticipants').optional().isInt({ min: 1 }),
  ],
  validate,
  createSession
);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Mettre à jour une session
 *     tags: [Sessions]
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
 *               formationId: { type: integer }
 *               formateurId: { type: integer }
 *               dateDebut: { type: string, format: date }
 *               dateFin: { type: string, format: date }
 *               heure: { type: string, format: time }
 *               lieu: { type: string }
 *               type: { type: string, enum: [INTER, INTRA] }
 *               statut: { type: string, enum: [PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED] }
 *               maxParticipants: { type: integer }
 *     responses:
 *       200:
 *         description: Session mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    param('id').isInt(),
    body('formationId').optional().isInt(),
    body('formateurId').optional().isInt(),
    body('dateDebut').optional().isISO8601(),
    body('dateFin').optional().isISO8601(),
    body('heure').optional().isISO8601(),
    body('lieu').optional().isString().notEmpty(),
    body('statut').optional().isIn(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']),
    body('maxParticipants').optional().isInt({ min: 1 }),
  ],
  validate,
  updateSession
);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Supprimer une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Session supprimée
 *       400:
 *         description: Des inscriptions sont liées à cette session
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteSession
);

module.exports = router;
