const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/user.controller');

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
 *   name: Users
 *   description: Gestion des utilisateurs (admin)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste paginée des utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche sur nom, prénom, email, matricule
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *         description: Nom du rôle (admin, formateur, participant)
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (rôle admin requis)
 */
router.get('/', authMiddleware, rbacMiddleware('admin'), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Détail d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Utilisateur
 *       404:
 *         description: Introuvable
 */
router.get(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  getUserById
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un utilisateur avec rôle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prenom, nom, matricule, email, motDePasse, roleId]
 *             properties:
 *               prenom: { type: string }
 *               nom: { type: string }
 *               matricule: { type: string }
 *               email: { type: string, format: email }
 *               motDePasse: { type: string, format: password, minLength: 6 }
 *               roleId: { type: integer }
 *               college: { type: string }
 *               genre: { type: string, enum: [Male, Female] }
 *               dateNaissance: { type: string, format: date }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Utilisateur créé
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
    body('matricule').optional().isString(),
    body('email').isEmail(),
    body('motDePasse').isLength({ min: 6 }),
    body('roleId').isInt(),
    body('college').optional().isString(),
    body('genre').optional().isIn(['Male', 'Female']),
    body('dateNaissance').optional().isISO8601(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  createUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
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
 *               motDePasse: { type: string, format: password, minLength: 8 }
 *               roleId: { type: integer }
 *               college: { type: string }
 *               genre: { type: string, enum: [Male, Female] }
 *               dateNaissance: { type: string, format: date }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
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
    body('motDePasse').optional().isLength({ min: 8 }),
    body('roleId').optional().isInt(),
    body('college').optional().isString(),
    body('genre').optional().isIn(['Male', 'Female']),
    body('dateNaissance').optional().isISO8601(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  updateUser
);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Activer / désactiver un compte
 *     tags: [Users]
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
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       404:
 *         description: Introuvable
 */
router.patch(
  '/:id/status',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt(), body('isActive').isBoolean()],
  validate,
  toggleUserStatus
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
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
  deleteUser
);

module.exports = router;
