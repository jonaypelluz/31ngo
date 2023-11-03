'use strict';

const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connect;
