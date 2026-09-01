const express = require('express');

const router = express.Router();

const {
  getDashboardStats,
  getUpcomingSessions,
  getActivity,
  getChartData,
} = require('../controllers/dashboard.controller');

const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistiques et données du tableau de bord
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Statistiques globales du tableau de bord
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard
 */
router.get('/stats', authMiddleware, rbacMiddleware('admin'), getDashboardStats);

/**
 * @swagger
 * /dashboard/upcoming-sessions:
 *   get:
 *     summary: Prochaines sessions planifiées
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prochaines sessions
 */
router.get('/upcoming-sessions', authMiddleware, rbacMiddleware('admin'), getUpcomingSessions);

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Activité récente
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des activités récentes
 */
router.get('/activity', authMiddleware, rbacMiddleware('admin'), getActivity);

/**
 * @swagger
 * /dashboard/charts:
 *   get:
 *     summary: Données pour les graphiques
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données chart (trend participants + répartition catégories)
 */
router.get('/charts', authMiddleware, rbacMiddleware('admin'), getChartData);

module.exports = router;
