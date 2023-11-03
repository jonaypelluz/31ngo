'use strict';

const express = require('express');
const router = express.Router();
const UserController = require('@/repositories/user');

router.get('/:id', UserController.get);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);
router.post('/', UserController.create);

module.exports = router;
