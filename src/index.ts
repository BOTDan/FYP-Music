import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running!');
});
