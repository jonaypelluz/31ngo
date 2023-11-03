'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = Schema({
  status: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
