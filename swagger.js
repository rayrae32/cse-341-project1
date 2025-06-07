const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Users API',
        description: 'Users API with Authentication.',
    },
    host: 'https://cse-341-project1-anmp.onrender.com',
    basePath: '/api',
    schemes: ['https'],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [{ BearerAuth: [] }] // Apply authentication globally
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
