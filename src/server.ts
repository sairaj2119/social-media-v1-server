import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { createConnection } from 'typeorm';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';

(async () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
      optionsSuccessStatus: 200,
    })
  );
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/posts', postRoutes);
  app.use('/comments', commentRoutes);
  app.use('/like', likeRoutes);

  app.get('/', (_: Request, res: Response) => {
    res.send('working');
  });

  createConnection()
    .then(() => {
      console.log('conenected to database');
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log('server started');
      });
    })
    .catch((err) => {
      console.log('error in connecting database');
      console.log(err.message);
    });
})();
