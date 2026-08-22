const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'STEG Formation API',
      version: '1.0.0',
      description: 'API pour la plateforme de formation STeg',
      contact: {
        name: 'STEG Formation Backend',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '../controllers', '*.js').replace(/\\/g, '/'),
    path.join(__dirname, '../routes', '*.js').replace(/\\/g, '/'),
  ],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        docExpansion: 'none',
        tagSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    })
  );
};
