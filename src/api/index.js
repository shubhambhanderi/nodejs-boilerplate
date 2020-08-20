const express = require('express');
const expressJwt = require("express-jwt");

const emojis = require('./emojis');
const faqs = require('./faqs');
const as2020 = require('./as2020');
const auth = require('./auth');
// const user = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

// Make the app use the express-jwt authentication middleware on anything starting with "/api"
router.use("/api", expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }));

router.use('/emojis', emojis);
router.use('/faqs', faqs);
router.use('/api/as2020', as2020);
router.use('/auth', auth);
// router.use('/user', user);

module.exports = router;
