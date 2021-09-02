import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/currentuser';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true 
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', () => {
  throw new NotFoundError()
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connected to auth database')
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log('listening on port 4000!');
  });
};

start();