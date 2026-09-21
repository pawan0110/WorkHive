const Service = require('../models/Service');

async function createService(providerId, data) {
    const service = await Service.create({ ...data, providerId });
    return service;
}

async function listServices(filters = {}) {
    const query = { isActive: true };

    if (filters.category) query.category = filters.category;
    if (filters.maxPrice) query.priceMin = { $lte: Number(filters.maxPrice) };
    if (filters.search) query.title = { $regex: filters.search, $options: 'i' };

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;


    const services = await Service.find(query)
        .populate('providerId', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Service.countDocuments(query);

    return { services, total, page, pages: Math.ceil(total / limit)};
}

async function getServiceById(id) {
    const service = await Service.findById(id).populate('providerId', 'name avatarUrl');
    if(!service) {
        const err = new Error('Service not found');
        err.statusCode = 404;
        throw err;
    }
    return service;
}

async function updateService(id, providerId, updates) {
    const service =  await Service.findById(id);
    if(!service) {
        const err = new Error('Service not found');
        err.statusCode = 404;
        throw err;
    }

    if(service.providerId.toString() !== providerId) {
        const err = new Error('you do not own this service');
        err.statusCode = 403;
        throw err;
    }

    Object.assign(service, updates);
    await service.save();
    return service;
}

async function deleteService(id, providerId) {
    const service = await Service.findById(id);
    if(!service) {
        const err = new Error('Service not found');
        err.statusCode = 404;
        throw err;
    }

    if(service.providerId.toString() !== providerId) {
        const err = new Error('you do not own this service');
        err.statusCode = 403;
        throw err;
    }

    await service.deleteOne();
}

module.exports = {createService, listServices, getServiceById, updateService, deleteService};