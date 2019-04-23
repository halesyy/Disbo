const mongoose = require('mongoose');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const util = require('util');
fs.readdir = util.promisify(fs.readdir);

const env = process.env.NODE_ENV || 'prod';

// Connect to mongo
if (env === 'dev') {
  mongoose.connect(`mongodb://localhost:${config.dbPort}/disbo`);
} else {
  mongoose.connect(`mongodb://localhost:${config.dbPort}/disbo`);
}

// Collect models
const models = {};

fs.readdir(path.join(__dirname, '../models')).then(files => {
  for (const file of files) {
    const key = file.split('.')[0];
    models[key] = require(`../models/${key}`);
  }
}).catch(err => {
  throw err;
});

module.exports = models;
