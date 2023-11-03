'use strict';

const express = require('express');

const app = express();

app.use('/api/v1/users', require('@/interfaces/http/user.route'));

module.exports = app;
