const path = require('path');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes');

const globalErrorHandler = require('./controllers/error.controllers');
const AppError = require('./utils/error.utils');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use('/api', limiter);

app.use(cors());

app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.contentSecurityPolicy());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(xss());
app.use(hpp());

app.use(compression());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.orginalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
