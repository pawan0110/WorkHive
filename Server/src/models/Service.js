const mongoose = require('mongoose');

const serviceSchema = new MongooseError.Schema(
    {
        providerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        title: {type: String, required: true, trim: true},
        description: {type: String, required: true},
        category: {
            type: String,
            required: true,
            enum: ['web-development', 'mobile-development', 'ui-ux', 'graphic-design', 'content-writing', 'video-editing', 'digital-marketing'],
        },
        tags: [{type: String, trim: true}],
        priceMin: {type: Number, required: true},
        priceMax: {type: Number, required: true},
        deliveryDays: {type: Number, required: true},
        isActive: {type: Boolean, default: true},
    },
    { timestamps: true}
);

module.exports = mongoose.model('Service', serviceSchema);