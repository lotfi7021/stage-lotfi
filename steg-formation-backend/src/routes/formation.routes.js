const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getFormations,
  getFormationById,
  createFormation,
  updateFormation,
  deleteFormation,
} = require('../controllers/formation.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');

const validate = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Formations
 *   description: Gestion des formations
 */

/**
 * @swagger
 * /formations:
 *   get:
 *     summary: Liste des formations
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche sur titre, référence, catégorie
 *       - in: query
 *         name: categorie
 *         schema: { type: string }
 *         description: Filtre exact par catégorie
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [PLANNED, ACTIVE, IN_PROGRESS, COMPLETED, CANCELLED] }
 *         description: Filtre exact par statut
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des formations
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (rôle admin ou formateur requis)
 */
router.get('/', authMiddleware, rbacMiddleware('admin', 'formateur'), getFormations);

/**
 * @swagger
 * /formations/{id}:
 *   get:
 *     summary: Détail d'une formation
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Formation avec compteur sessions et factures
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (rôle admin ou formateur requis)
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin', 'formateur'),
  [param('id').isInt()],
  validate,
  getFormationById
);

/**
 * @swagger
 * /formations:
 *   post:
 *     summary: Créer une formation
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, reference, categorie, duree, maxParticipants]
 *             properties:
 *               titre: { type: string, maxLength: 150 }
 *               reference: { type: string, maxLength: 30 }
 *               categorie: { type: string, maxLength: 60 }
 *               objectifs: { type: string }
 *               prerequis: { type: string }
 *               modules: { type: string }
 *               duree: { type: string }
 *               prix: { type: string, format: decimal }
 *               maxParticipants: { type: integer, minimum: 1 }
 *               statut: { type: string, enum: [PLANNED, ACTIVE, IN_PROGRESS, COMPLETED, CANCELLED] }
 *     responses:
 *       201:
 *         description: Formation créée
 *       409:
 *         description: Référence déjà utilisée
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    body('titre').isString().notEmpty().isLength({ max: 150 }),
    body('reference').isString().notEmpty().isLength({ max: 30 }),
    body('categorie').isString().notEmpty().isLength({ max: 60 }),
    body('objectifs').optional().isString(),
    body('prerequis').optional().isString(),
    body('modules').optional().isString(),
    body('duree').isString().notEmpty(),
    body('prix').optional().isDecimal(),
    body('maxParticipants').isInt({ min: 1 }),
    body('statut').optional().isIn(['PLANNED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  ],
  validate,
  createFormation
);

/**
 * @swagger
 * /formations/{id}:
 *   put:
 *     summary: Mettre à jour une formation
 *     tags: [Formations]
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
 *               titre: { type: string, maxLength: 150 }
 *               reference: { type: string, maxLength: 30 }
 *               categorie: { type: string, maxLength: 60 }
 *               objectifs: { type: string }
 *               prerequis: { type: string }
 *               modules: { type: string }
 *               duree: { type: string }
 *               prix: { type: string, format: decimal }
 *               maxParticipants: { type: integer, minimum: 1 }
 *               statut: { type: string, enum: [PLANNED, ACTIVE, IN_PROGRESS, COMPLETED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Formation mise à jour
 *       404:
 *         description: Introuvable
 *       409:
 *         description: Référence déjà utilisée
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    param('id').isInt(),
    body('titre').optional().isString().notEmpty().isLength({ max: 150 }),
    body('reference').optional().isString().notEmpty().isLength({ max: 30 }),
    body('categorie').optional().isString().notEmpty().isLength({ max: 60 }),
    body('objectifs').optional().isString(),
    body('prerequis').optional().isString(),
    body('modules').optional().isString(),
    body('duree').optional().isString().notEmpty(),
    body('prix').optional().isDecimal(),
    body('maxParticipants').optional().isInt({ min: 1 }),
    body('statut').optional().isIn(['PLANNED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  ],
  validate,
  updateFormation
);

/**
 * @swagger
 * /formations/{id}:
 *   delete:
 *     summary: Supprimer une formation
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Formation supprimée
 *       400:
 *         description: Des sessions sont liées à cette formation
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteFormation
);

module.exports = router;
