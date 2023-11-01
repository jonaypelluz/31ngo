'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.statics.userlist = function (cb) {
  this.find().limit(20).exec(function (err, users) {
    if (err) return cb(err);

    cb(null, users);
  });
};

module.exports = mongoose.model('User', UserSchema, 'users');
