const express = require('express');
const { create, list, getOne, update, remove} = require('../controllers/service.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const router = express.Router();

//public - anyone can browse
router.get('/', list);
router.get('/:id', getOne);

// provider-only - must be logged in AND be a provider
router.post('/', requireAuth, requireRole('provider'), create);
router.put('/:id', requireAuth, requireRole('provider'), remove);

module.exports = router;