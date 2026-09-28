const mongoose = require('mongoose');

const MILESTONE_STATUSES = ['pending', 'in_progress', 'submitted', 'approved'];

const milestoneSchema = new mongoose.Schema(
    {
        orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
        sequence: { type: Number, required: true},
        title: { type: String, required: true, trim: true},
        description: { type: String, default: ''},
        amount: { type: Number, required: true, min: 1},
        dueDate: { type: Date},
        status: {type: String, enum: MILESTONE_STATUSES, default: 'pending'},
        submissionNote: { type: String, default: ''},
    },
    {timestamps: true}
);

milestoneSchema.index({ orderId: 1, sequence: 1 }, {unique: true});

module.exports = mongoose.model('Milestone', milestoneSchema);
module.exports.MILESTONE_STATUSES = MILESTONE_STATUSES;