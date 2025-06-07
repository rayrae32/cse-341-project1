const express = require('express');
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: "1.0.0",
      description: "Users API with Authentication using JWT",
    },
    servers: [
      {
        url: "https://cse-341-project1-anmp.onrender.com/api/data", // full URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Ensure all your route files (auth, index, etc.) are here
};

const swaggerDocs = swaggerJsdoc(options);

// Swagger UI route
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = router;
