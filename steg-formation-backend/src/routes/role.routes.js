const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/role.controller');

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
 *   name: Roles
 *   description: Gestion des rôles (admin)
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Liste des rôles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (rôle admin requis)
 */
router.get('/', authMiddleware, rbacMiddleware('admin'), getRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Créer un rôle
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nomRole]
 *             properties:
 *               nomRole: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Rôle créé
 *       409:
 *         description: Ce rôle existe déjà
 */
router.post(
  '/',
  authMiddleware,
  rbacMiddleware('admin'),
  [body('nomRole').isString().notEmpty(), body('description').optional().isString()],
  validate,
  createRole
);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Mettre à jour un rôle
 *     tags: [Roles]
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
 *               nomRole: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       404:
 *         description: Introuvable
 *       409:
 *         description: Ce rôle existe déjà
 */
router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt(), body('nomRole').optional().isString().notEmpty(), body('description').optional().isString()],
  validate,
  updateRole
);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Supprimer un rôle (sans utilisateurs)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Rôle supprimé
 *       400:
 *         description: Rôle attribué à des utilisateurs
 *       404:
 *         description: Introuvable
 */
router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('admin'),
  [param('id').isInt()],
  validate,
  deleteRole
);

module.exports = router;
