const Counter = require('../models/counter.model');

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  return counter.seq;
}

module.exports = {
  getNextSequence,
};
