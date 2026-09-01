const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getInscriptions,
  getInscriptionById,
  createInscription,
  updateInscription,
  deleteInscription,
  getInscriptionsByParticipant,
} = require('../controllers/inscription.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Inscriptions
 *   description: Gestion des inscriptions aux sessions de formation
 */

/**
 * @swagger
 * /inscriptions:
 *   get:
 *     summary: Liste des inscriptions
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche sur nom, prénom, email du participant ou titre de formation
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [ENROLLED, CONFIRMED, ATTENDED, CANCELLED, WAITLIST] }
 *         description: Filtre exact par statut
 *       - in: query
 *         name: sessionId
 *         schema: { type: integer }
 *         description: Filtre par session
 *       - in: query
 *         name: participantId
 *         schema: { type: integer }
 *         description: Filtre par participant
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getInscriptions);

/**
 * @swagger
 * /inscriptions/participant/{participantId}:
 *   get:
 *     summary: Inscriptions d'un participant
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: statut
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Inscriptions du participant
 *       401:
 *         description: Unauthorized
 */
router.get('/participant/:participantId', authMiddleware, getInscriptionsByParticipant);

/**
 * @swagger
 * /inscriptions/{id}:
 *   get:
 *     summary: Détail d'une inscription
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inscription avec session et participant
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  [param('id').isInt()],
  validate,
  getInscriptionById
);

/**
 * @swagger
 * /inscriptions:
 *   post:
 *     summary: Inscrire un participant à une session
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, participantId]
 *             properties:
 *               sessionId: { type: integer }
 *               participantId: { type: integer }
 *               statut: { type: string, enum: [ENROLLED, CONFIRMED, ATTENDED, CANCELLED, WAITLIST], default: ENROLLED }
 *     responses:
 *       201:
 *         description: Inscription créée
 *       409:
 *         description: Participant déjà inscrit
 *       400:
 *         description: Session complète ou clôturée
 *       404:
 *         description: Session ou participant introuvable
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin', 'participant'),
  [
    body('sessionId').isInt(),
    body('participantId').isInt(),
    body('statut').optional().isIn(['ENROLLED', 'CONFIRMED', 'ATTENDED', 'CANCELLED', 'WAITLIST']),
  ],
  validate,
  createInscription
);

/**
 * @swagger
 * /inscriptions/{id}:
 *   put:
 *     summary: Mettre à jour le statut d'une inscription
 *     tags: [Inscriptions]
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
 *             required: [statut]
 *             properties:
 *               statut: { type: string, enum: [ENROLLED, CONFIRMED, ATTENDED, CANCELLED, WAITLIST] }
 *     responses:
 *       200:
 *         description: Inscription mise à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    param('id').isInt(),
    body('statut').isIn(['ENROLLED', 'CONFIRMED', 'ATTENDED', 'CANCELLED', 'WAITLIST']),
  ],
  validate,
  updateInscription
);

/**
 * @swagger
 * /inscriptions/{id}:
 *   delete:
 *     summary: Supprimer une inscription
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inscription supprimée
 *       400:
 *         description: Des présences sont liées
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteInscription
);

module.exports = router;
