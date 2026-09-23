const {
    createService,
    listServices,
    getServiceById,
    updateService,
    deleteService,
} = require('../services/service.service');

async function create(req, res, next) {
    try {
        const service = await createService(req.user.id, req.body);
        res.status(201).json({ service});
    } catch (error) {
        next(error);
    }
}

async function list(req, res, next) {
    try {
        const result = await listServices(req.query);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function getOne(req, res, next) {
    try {
        const service = await getServiceById(req.params.id);
        res.json({service});
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const service = await updateService(req.params.id, req.user.id, req.body)
        res.json({ service});
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        await deleteService(req.params.id, req.user.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = { create, list, getOne, update, remove};