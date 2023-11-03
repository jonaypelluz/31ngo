'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bingoCardSchema = Schema({
  numbers: { type: [Number], required: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const BingoCard = mongoose.model('BingoCard', bingoCardSchema);

module.exports = BingoCard;
