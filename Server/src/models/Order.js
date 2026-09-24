const mongoose = require('mongoose');

const ORDER_STATUSES = [
    'REQUESTED',
    'ACCEPTED',
    'IN_PROGRESS',
    'SUBMITTED',
    'REVISION_REQUESTED',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED',
];

const orderSchema = new mongoose.Schema(
    {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ORDER_STATUSES, default: 'REQUESTED' },
        totalAmount: { type: number, required: true },
        statusHistory: [
            {
                status: { type: String, enum: ORDER_STATUSES, required: true },
                changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                changedByRole: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],

    },
    {timestamps: true}
);

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
