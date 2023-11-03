'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const callSchema = Schema({
  number: { type: Number, required: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  timestamp: { type: Number, required: true }
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;
