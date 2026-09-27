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