const { Router } = require('express');
const router = new Router();

const db = require('../utils/db');
const config = require('../config');
const main = require('../app');

/**
 * This file contains global routes that should be executed before main routes get executed
 */

 router.use((req, res, next) => {
   // Log IP for purposes
   console.log(`IP: ${req.ip}`);

   // Touch session to keep it alive for longer
   req.session.touch();

   // Auth stuff
   res.locals.user = null;
   if (!req.session.did || req.session.did === '') return next();
   const id = req.session.did;

   db.User.findOne({ id: id }, (err, user) => {
     if (err) return next();
     if (!user) return next();
     if (req.header('Authorization') && user.token !== req.header('Authorization')) return next();
     req.user = user;
     res.locals.user = user;
     return next();
   });
 });

module.exports = router;
