'use strict';

const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.VUE_APP_DB_BASE_URL}:27017/31ngo`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = {
  connect
};
