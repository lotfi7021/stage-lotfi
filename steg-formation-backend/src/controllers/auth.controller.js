const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

const sendTokenResponse = (utilisateur, statusCode, res) => {
  const token = generateToken(utilisateur.id);

  const cookieOptions = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role.nomRole,
        isActive: utilisateur.isActive,
        createdAt: utilisateur.createdAt,
      },
    });
};

/**
 * @POST /api/auth/login
 * Authentifie un utilisateur et retourne un JWT
 */
exports.login = async (req, res, next) => {
  try {
    const { email, matricule, motDePasse } = req.body;

    const identifiant = email || matricule;
    if (!identifiant || !motDePasse) {
      return res.status(400).json({ error: 'Please provide email/matricule and password.' });
    }

    const utilisateur = await prisma.utilisateur.findFirst({
      where: {
        OR: [{ email: identifiant }, { matricule: identifiant }],
      },
      include: { role: true },
    });

    if (!utilisateur) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!utilisateur.isActive) {
      return res.status(403).json({ error: 'Account deactivated.' });
    }

    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    sendTokenResponse(utilisateur, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * @GET /api/auth/me
 * Retourne les informations de l'utilisateur connecté
 */
exports.getMe = async (req, res, next) => {
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: req.user.id },
      include: { role: true },
    });

    if (!utilisateur) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        matricule: utilisateur.matricule,
        college: utilisateur.college,
        genre: utilisateur.genre,
        dateNaissance: utilisateur.dateNaissance,
        role: utilisateur.role.nomRole,
        isActive: utilisateur.isActive,
        createdAt: utilisateur.createdAt,
        updatedAt: utilisateur.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @PUT /api/auth/change-password
 * Change le mot de passe de l'utilisateur connecté
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide current and new password.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(currentPassword, utilisateur.motDePasse);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.utilisateur.update({
      where: { id: req.user.id },
      data: { motDePasse: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @POST /api/auth/logout
 * Déconnecte l'utilisateur (supprime le cookie)
 */
exports.logout = (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', { expires: new Date(0), httpOnly: true })
    .json({ success: true, message: 'Logged out successfully.' });
};
