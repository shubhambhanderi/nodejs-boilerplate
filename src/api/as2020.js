const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
const monk = require('monk');
// const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
db.then(() => {
  console.log('REPO3 : Connected correctly to server');
});
const REPO3 = db.get('REPO3');

const router = express.Router();

//get list of parties
router.get('/listofparties', async (req, res, next) => {
  try {
    const items = await REPO3.aggregate(
      [
        {
          "$group": {
            _id: {
              partyName: "$partyName",
              brokerName: "$brokerName"
            }
          }
        }
      ]
    );
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//get party data
router.get('/partydata/:pn/:bn', async (req, res, next) => {
  try {
    // console.log(req.params);
    const { pn, bn } = req.params;
    const items = await REPO3.find(
      { "partyName": pn, "brokerName": bn }
    );
    res.json(items);
  } catch (error) {
    next(error);
  }
})

module.exports = router;