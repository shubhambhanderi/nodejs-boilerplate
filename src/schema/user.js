// const express = require('express');
// const monk = require('monk');
const Joi = require('@hapi/joi');

// const db = monk(process.env.MONGO_URI);
// db.then(() => {
//   console.log('userData : Connected correctly to server');
// });
// const userData = db.get('userData');

const userSchema = Joi.object({
  username: Joi.string().trim().lowercase().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  isAdmin: Joi.boolean(),
});

// const router = express.Router();

//Create One
// router.post('/', async (req, res, next) => {
//   try {
//     const value = await schema.validateAsync(req.body);
//     const inserted = await userData.insert(value);
//     res.json(inserted);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = userSchema;