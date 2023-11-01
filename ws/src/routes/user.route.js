'use strict';

const express = require('express');
const router = express.Router();
const useController = require('@/controllers/user.controller');

router.get('/:id', useController.get);
router.put('/:id', useController.update);
router.delete('/:id', useController.remove);
router.post('/', useController.create);

module.exports = router;
