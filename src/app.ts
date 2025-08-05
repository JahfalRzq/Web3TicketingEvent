// src/app.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import router from './routes/index';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://staging.cms.npcindonesia.or.id',
      'https://staging.npcindonesia.or.id',
    ],
  })
);
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/', router);
app.get('/', (req, res) => {
  res.send('API Running');
});

export default app;
