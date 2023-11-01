'use strict';

const express = require('express');

const app = express();

app.use('/api/v1/users', require('@/routes/user.route'));

module.exports = app;
