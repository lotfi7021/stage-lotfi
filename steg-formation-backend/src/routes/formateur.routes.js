const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getFormateurs,
  getFormateurById,
  createFormateur,
  updateFormateur,
  deleteFormateur,
} = require('../controllers/formateur.controller');

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
 *   name: Formateurs
 *   description: Gestion des formateurs (admin)
 */

/**
 * @swagger
 * /formateurs:
 *   get:
 *     summary: Liste des formateurs
 *     tags: [Formateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche sur nom, prénom, email, matricule
 *     responses:
 *       200:
 *         description: Liste des formateurs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (rôle admin requis)
 */
router.get('/', authMiddleware, rbacMiddleware('admin'), getFormateurs);

/**
 * @swagger
 * /formateurs/{id}:
 *   get:
 *     summary: Détail d'un formateur
 *     tags: [Formateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Formateur
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  getFormateurById
);

/**
 * @swagger
 * /formateurs:
 *   post:
 *     summary: Créer un formateur (compte + profil)
 *     tags: [Formateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prenom, nom, matricule, email]
 *             properties:
 *               prenom: { type: string }
 *               nom: { type: string }
 *               matricule: { type: string }
 *               email: { type: string, format: email }
 *               motDePasse: { type: string, format: password, minLength: 6 }
 *               genre: { type: string, enum: [Male, Female] }
 *               specialite: { type: string }
 *               qualifications: { type: string }
 *               disponibilites: { type: boolean }
 *     responses:
 *       201:
 *         description: Formateur créé
 *       409:
 *         description: Email ou matricule déjà utilisé
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    body('prenom').isString().notEmpty(),
    body('nom').isString().notEmpty(),
    body('matricule').isString().notEmpty(),
    body('email').isEmail(),
    body('motDePasse').optional().isLength({ min: 6 }),
    body('genre').optional().isIn(['Male', 'Female']),
    body('specialite').optional().isString(),
    body('qualifications').optional().isString(),
    body('disponibilites').optional().isBoolean(),
  ],
  validate,
  createFormateur
);

/**
 * @swagger
 * /formateurs/{id}:
 *   put:
 *     summary: Mettre à jour un formateur
 *     tags: [Formateurs]
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
 *               prenom: { type: string }
 *               nom: { type: string }
 *               matricule: { type: string }
 *               email: { type: string, format: email }
 *               genre: { type: string, enum: [Male, Female] }
 *               specialite: { type: string }
 *               qualifications: { type: string }
 *               disponibilites: { type: boolean }
 *     responses:
 *       200:
 *         description: Formateur mis à jour
 *       404:
 *         description: Introuvable
 *       409:
 *         description: Email ou matricule déjà utilisé
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [
    param('id').isInt(),
    body('prenom').optional().isString().notEmpty(),
    body('nom').optional().isString().notEmpty(),
    body('matricule').optional().isString().notEmpty(),
    body('email').optional().isEmail(),
    body('genre').optional().isIn(['Male', 'Female']),
    body('specialite').optional().isString(),
    body('qualifications').optional().isString(),
    body('disponibilites').optional().isBoolean(),
  ],
  validate,
  updateFormateur
);

/**
 * @swagger
 * /formateurs/{id}:
 *   delete:
 *     summary: Supprimer un formateur
 *     tags: [Formateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Formateur supprimé
 *       400:
 *         description: Impossible de supprimer son propre compte
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteFormateur
);

module.exports = router;
