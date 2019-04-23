const { Router } = require('express');
const router = new Router();
const fetch = require('node-fetch');

const db = require('../utils/db');
const config = require('../config');
const main = require('../app');

router.get('/', (req, res) => {
  res.render('client', { user: req.user });
});


module.exports = router;
