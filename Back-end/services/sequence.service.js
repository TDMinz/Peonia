const Counter = require('../models/counter.model');

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  return counter.seq;
}

function formatCode(prefix, seq) {
  return `${prefix}-${String(seq).padStart(5, '0')}`;
}

module.exports = { getNextSequence, formatCode };
