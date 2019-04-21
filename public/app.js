const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const path = require('path');

const db = require('./utils/db');

const config = require('./config');
const env = process.env.NODE_ENV || 'prod';

class Main {
  constructor() {
    this.app = app;
    this.env = env;
    this.db = db;
  }

  setup() {
    app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}`);
    });

    // View engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // Get the correct data by trusting the data given by a proxy
    app.enable('trust proxy');

    // Logger
    app.use(logger('dev'));

    // Parsers
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
    app.use(cookieParser());

    // Sessions
    app.use(session({
      proxy: true,
      secret: config.secret,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 86400000 }),
      cookie: { maxAge: 86400000, secure: config.url.indexOf('dev') === -1 },
    }));

    // Static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Set global favicon
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    // Use routes
    // app.use('/', require('./routes/static'));
    app.use('/', require('./routes/auth'));
    // app.use('/', require('./routes/home'));

    // Error handlers
    const errorHandlers = require('./routes/error');
    app.use(errorHandlers.notFound);
    app.use(errorHandlers.error);

    return this;
  }
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const forkWorker = () => {
    const worker = cluster.fork();
    worker.on('error', err => {
      console.error(err);
    });
    return worker;
  };

  if (env === 'dev') {
    forkWorker();
  } else {
    for (let i = 0; i < numCPUs; i++) {
      forkWorker();
    }
  }

  cluster.on('exit', deadWorker => {
    const worker = forkWorker();

    console.error(`worker ${deadWorker.process.pid} died.`);
    console.log(`worker ${worker.process.pid} born.`);
  });
} else {
  console.log(`Worker ${process.pid} is running`);

  const instance = new Main();
  module.exports = instance;
  instance.setup();
}
