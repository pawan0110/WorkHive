const express = require('express');
const {create, transition, getOne, listMine} = require('../controllers/order.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole('customer'), create);
router.get('/', listMine);
router.get('/:id', getOne);
router.patch('/:id/transition', transition);

module.exports = router;