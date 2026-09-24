const Order = require('../models/Order');
const Service = require('../models/Service');
const { computerNextStatus } = require('./orderStateMachine');

async function createOrder(customerId, serviceId) {
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
        const err = new Error('Service not found or unavailable');
        err.statusCode = 404;
        throw err;
    }

    const order = await Order.create({
        serviceId,
        customerId,
        providerId: service.providerId,
        totalAmount: service.priceMin,
        statusHistory: [
            { status: 'REQUESTED', changeBy: customerId, changedByRole: 'customer' },
        ],
    });
    return order;
}

async function transitionOrder(orderId, action, actor) {
    const order = await Order.findById(orderId);
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }

    const isParticipant = order.customerId.toString() === actor.id || order.providerId.toString() === actor.id;
    if (!isParticipant) {
        const err = new Error('you are not part of this order');
        err.statusCode = 403;
        throw err;
    }

    const newStatus = computerNextStatus(order.status, action, actor.role);

    order.status = newStatus;
    order.statusHistory.push({
        status: newStatus,
        changedBy: actor.id,
        changedByRole: actor.role,
    });

    await order.save();
    return order;
}

async function getOrderById(orderId, actorId) {
    const order = await Order.findById(orderId)
        .populate('serviceId', 'title')
        .populate('customerId', 'name')
        .populate('providerId', ' name');
    
    if(!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }

    const isParticipant = order.customerId._id.toString() === actorId  || order.providerId._id.toString() === actorId;

    if(!isParticipant) {
        const err = new Error('you are not part of this order');
        err.statusCode = 403;
        throw err;
    }

    return order;

}


async function lisMyOrders(userId, role) {
    const filter = role === 'provider' ? {providerId: userId} : {customerId: userId};
    return (await Order.find(filter).populate('serviceId', 'title')).toSorted({createdAt: -1});
}

module.exports = { createOrder, transitionOrder, getOrderById, listMyOrders};