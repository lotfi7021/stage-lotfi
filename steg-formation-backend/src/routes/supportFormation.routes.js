const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getSupports,
  getSupportById,
  createSupport,
  updateSupport,
  deleteSupport,
} = require('../controllers/supportFormation.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: SupportsFormation
 *   description: Gestion des supports de formation
 */

/**
 * @swagger
 * /supports:
 *   get:
 *     summary: Liste des supports
 *     tags: [SupportsFormation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [VALIDE, EN_ATTENTE] }
 *       - in: query
 *         name: sessionId
 *         schema: { type: integer }
 *       - in: query
 *         name: categorie
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des supports
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getSupports);

/**
 * @swagger
 * /supports/{id}:
 *   get:
 *     summary: Détail d'un support
 *     tags: [SupportsFormation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détail du support
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur', 'participant'),
  [param('id').isInt()],
  validate,
  getSupportById
);

/**
 * @swagger
 * /supports:
 *   post:
 *     summary: Créer un support
 *     tags: [SupportsFormation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, nom, chemin, uploaderId]
 *             properties:
 *               sessionId: { type: integer }
 *               nom: { type: string }
 *               chemin: { type: string }
 *               categorie: { type: string }
 *               type: { type: string }
 *               taille: { type: string }
 *               uploaderId: { type: integer }
 *     responses:
 *       201:
 *         description: Support créé
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    body('sessionId').isInt(),
    body('nom').isString().notEmpty(),
    body('chemin').isString().notEmpty(),
    body('categorie').optional().isString(),
    body('type').optional().isString(),
    body('taille').optional().isString(),
  ],
  validate,
  createSupport
);

/**
 * @swagger
 * /supports/{id}:
 *   put:
 *     summary: Mettre à jour un support
 *     tags: [SupportsFormation]
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
 *               statut: { type: string, enum: [VALIDE, EN_ATTENTE] }
 *               nom: { type: string }
 *               categorie: { type: string }
 *     responses:
 *       200:
 *         description: Support mis à jour
 *       404:
 *         description: Introuvable
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [
    param('id').isInt(),
    body('statut').optional().isIn(['VALIDE', 'EN_ATTENTE']),
    body('nom').optional().isString(),
    body('categorie').optional().isString(),
  ],
  validate,
  updateSupport
);

/**
 * @swagger
 * /supports/{id}:
 *   delete:
 *     summary: Supprimer un support
 *     tags: [SupportsFormation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Support supprimé
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteSupport
);

module.exports = router;
