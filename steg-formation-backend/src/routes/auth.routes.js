const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const { login, register, getMe, changePassword, logout } = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');

// Validation middleware
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
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a user account (default role: participant)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - matricule
 *               - email
 *               - motDePasse
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               matricule:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               college:
 *                 type: string
 *               genre:
 *                 type: string
 *                 enum: [Male, Female]
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Account created
 *       409:
 *         description: Email or matricule already used
 */
router.post(
  '/register',
  [
    body('prenom').isString().notEmpty(),
    body('nom').isString().notEmpty(),
    body('matricule').isString().notEmpty(),
    body('email').isEmail(),
    body('motDePasse').isLength({ min: 6 }),
    body('college').optional().isString(),
    body('genre').optional().isIn(['Male', 'Female']),
    body('dateNaissance').optional().isISO8601(),
  ],
  validate,
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user & get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               matricule:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('email').optional().isEmail(),
    body('matricule').optional().isString(),
    body('motDePasse').exists().isString(),
  ],
  validate,
  login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, getMe);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change current user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Bad request
 *       401:
 *         description: Current password incorrect
 */
router.put(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 8 }),
    body('confirmPassword').exists(),
  ],
  validate,
  changePassword
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (clears token cookie)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authMiddleware, logout);

module.exports = router;
