/**
 * Middleware RBAC (Role-Based Access Control)
 * Usage: router.get('/admin', auth, rbac(['admin']), controller)
 * @param {...string} roles - Rôles autorisées
 */
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions.',
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};
