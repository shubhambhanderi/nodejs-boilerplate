//auth.js
const express = require("express");
const monk = require('monk');
const User = require("../schema/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
//DB connection
const db = monk(process.env.MONGO_URI);
db.then(() => {
  console.log('userData : Connected correctly to server');
});
const userData = db.get('userData');

//post a new user to user collection (signing up)
router.post("/signup", (req, res, next) => {
  userData.findOne({ username: req.body.username.toLowerCase() }, async (err, existingUser) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    // If the db doesn't return "null" it means there's already a user with that username.  Send the error object to the global error handler on your server file.
    if (existingUser !== null) {
      res.status(400);
      return next(new Error("That username already exists!"));
    }

    const value = await User.validateAsync(req.body);
    const inserted = await userData.insert(value);
    res.json(inserted);
    // If the user signs up, we might as well give them a token right now
    // So they don't then immediately have to log in as well
    const token = jwt.sign(inserted, process.env.SECRET);
    return res.status(201).send({ success: true, user: inserted, token });
  });

  // If the function reaches this point and hasn't returned already, we're safe
  // to create the new user in the database.
});

router.post("/login", (req, res, next) => {
  // Try to find the user with the submitted username (lowercased)
  userData.findOne({ username: req.body.username.toLowerCase() }, async (err, user) => {
    if (err) {
      return next(err);
    };
    // If that user isn't in the database OR the password is wrong:
    if (!user || user.password !== req.body.password) {
      res.status(403);
      return next(new Error("Email or password are incorrect"));
    }

    // If username and password both match an entry in the database,
    // create a JWT! Add the user object as the payload and pass in the secret.
    // This secret is like a "password" for your JWT, so when you decode it
    // you'll pass the same secret used to create the JWT so that it knows
    // you're allowed to decode it.

    let userWithoutPassword = { ...user, password: null };

    const token = jwt.sign(userWithoutPassword, process.env.SECRET,);

    // Send the token back to the client app.
    return res.send({ token: token, user: user, success: true })
  });
});

module.exports = router;