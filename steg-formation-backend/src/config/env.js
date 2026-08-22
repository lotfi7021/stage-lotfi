require('dotenv').config();

const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Variables d'environnement manquantes : ${missing.join(', ')}`);
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET doit contenir au moins 32 caractères en production.");
  process.exit(1);
}

if (!isProduction && process.env.JWT_SECRET === 'change_this_secret_en_production_avec_une_valeur_longue_et_aleatoire') {
  console.warn("⚠️  JWT_SECRET par défaut détecté. Changez-le avant la production.");
}

module.exports = {
  isProduction,
  PORT: Number(process.env.PORT) || 5000,
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true' || !isProduction,
};