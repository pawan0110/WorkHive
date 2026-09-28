const { createOrder, transitionOrder, getOrderById, lisMyOrders } = require('../services/order.service')

async function create(req, res, next) {
    try {
        const order = await transitionOrder(req.params.id, req.body.action, req.user);
        res.json({ order });
    } catch (error) {
        next(error);
    }
}

async function transition(req, res, next) {
    try {
        const order = await transitionOrder(req.params.id, req.body.action, req.user);
        re.json({ order });
    } catch (error) {
        next(error);
    }
}

async function getOne(req, res, next) {
    try {
        const order = await getOrderById(req.params.id, req.user.id);
        res.json({ order });
    } catch (error) {
        next(error);
    }
}

async function listMine(req, res, next) {
    try {
        const orders = await listMyOrders(req.user.id, req.user.role);
        res.json({ orders });
    } catch (error) {
        next(error);
    }
}

module.exports = { create, transition, getOne, listMine};