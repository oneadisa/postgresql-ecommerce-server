import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import cors from 'cors';
import morgan from 'morgan';
import errorhandler from 'errorhandler';

import routes from './routes';

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());
if (!isProduction) {
  app.use(errorhandler());
};

app.use('/api', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
});


// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Finally, let's start our server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;
