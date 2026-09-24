// Maps: current status -> { acion -> { to, allowedRoles}}

const TRANSITIONS = {
    REQUESTED: {
        accept: {to: 'ACCEPTED', allowedRoles: ['provider']},
        cancel: {to: 'CANCELLED', allowedRoles: ['customer', 'provider']},
    },
    ACCEPTED: {
        start: {to: 'IN_PROGRESS', allowedRoles: ['customer', 'provider']},
        cancel: {to: 'CANCELLED', allowedRoles: ['customer', 'provider']}
    },
    IN_PROGRESS: {
        submit: { to: 'SUBMITTED', allowedRoles: ['provider']},
        cancel: { to: 'CANCELLED', allowedRoles: ['customer', 'provider']}
    },
    SUBMITTED: {
        approve: { to: 'COMPLETED', allowedRoles: ['customer']},
        requestRevision: { to: 'REVISION_REQUESTED', allowedRoles: ['customer']}
    },
    REVISION_REQUESTED: {
        resubmit: { to: 'IN_PROGRESS', allowedRoles: ['provider']},
    },
};

function computerNextStatus(currentStatus, action, actorRole) {
    const stateTransitions = TRANSITIONS[currentStatus];

    if(!stateTransitions) {
        const err = new Error(`Order in status "${currentStatus}" cannot be changed further`);
        err.statusCode = 400;
        throw err;
    }

    const transition = stateTransitions[action];

    if(!transition) {
        const err = new Error(`Action "${action}" is not valid from status "${currentStatus}"`);
        err.statusCode = 400;
        throw err;
    }

    if(!transition.allowedRoles.includes(actorRole)) {
        const err = new Error(`Role "${actorRole}" is not allowed to perform "${action}"`);
        err.statusCode = 403;
        throw err;
    }

    return transition.to;
}

module.exports = {computerNextStatus, TRANSITIONS};