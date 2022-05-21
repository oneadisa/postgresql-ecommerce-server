import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
import cors from 'cors';
import morgan from 'morgan';
import errorhandler from 'errorhandler';
// import {Application} from 'express';

import routes from './routes';

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

app.use(morgan('dev'));

// app.use(cors());

const corsConfig = (app) => {
  app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
      }),
  );
};


// Enable CORS with various options
corsConfig(app);

//     {
//       origin: '*',
//       origin: ['https://www.gaged.io', 'http://localhost:3000/'],
//       methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
//     },
// ));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'https://www.gaged.io');
//   // update to match the domain you will make the request from
//   res.header('Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

app.use(express.json({limit: '50mb'}));
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

app.get('/', (_, res) => {
  return res.send({
    msg: 'Hello Gaged server',
    Time: new Date(),
    status: 'running',
    server: 'Express + Babel JS Server',
  });
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
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;
