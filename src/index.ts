import express from 'express';
import { config, outputConfigWarnings } from './config';

outputConfigWarnings();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(config.PORT || 8080, () => {
  console.log('Server running!');
});
