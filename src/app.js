import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import database from './database';
import createRouter from './router';
import logErrors from './middlewares/logErrors';
import swaggerDocs from '../swagger.json';

function injectMiddlewares(app, middlewares) {
    middlewares.forEach((middleware) => {
        if (typeof middleware === 'function') {
            app.use(middleware());
        } else {
            const [createMiddleware, args] = middleware;
            app.use(createMiddleware(args));
        }
    });
}

async function createApp() {
    const app = express();

    const middlewares = [
        helmet,
        cors,
        compression,
        express.json,
        [express.urlencoded, { extended: true }],
        logErrors,
    ];

    injectMiddlewares(app, middlewares);

    const router = await createRouter();
    app.use('/api', router);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.database = database;

    return app;
}

export default createApp;
