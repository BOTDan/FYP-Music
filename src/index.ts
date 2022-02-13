import express from 'express';
import authRouter from './auth/Router';
import { config, outputConfigWarnings } from './config';

import { setupDatabase } from './database';
import { handleErrorMiddleware } from './errors';

outputConfigWarnings();

setupDatabase()
  .then(() => {
    const app = express();

    app.use(express.json());

    app.use('/auth', authRouter);

    app.get('/', (req, res) => {
      res.send('Hello, world!');
    });

    app.use(handleErrorMiddleware);

    app.listen(config.PORT || 8080, async () => {
      console.log('Server running!');
    });
  })
  .catch((error) => {
    console.error(error);
  });
