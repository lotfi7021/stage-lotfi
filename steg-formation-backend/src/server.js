require('./config/env');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { isProduction, PORT, CLIENT_URL, ENABLE_SWAGGER } = require('./config/env');
const setupSwagger = require('./config/swagger');

const app = express();

// Sécurité : headers HTTP (HSTS, X-Content-Type-Options, etc.)
app.use(helmet());

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Rate limiting global de l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez plus tard.' },
});
app.use('/api', apiLimiter);

// Rate limiting strict contre le brute force (login / register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Réessayez plus tard.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/roles', require('./routes/role.routes'));
app.use('/api/formateurs', require('./routes/formateur.routes'));

// Swagger : désactivé en production sauf si ENABLE_SWAGGER=true
if (ENABLE_SWAGGER) {
  setupSwagger(app);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(require('./middleware/error.middleware'));

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}${isProduction ? ' (production)' : ' (development)'}`);
});