const TRANSITIONS = {
    pending: {
        start: { to: 'in_progress', allowedRoles: ['provider'] },
    },
    in_progress: {
        submit: { to: 'submitted', allowedRoles: ['provider'] },

    },
    submitted: {
        approve: {to: 'approved', allowedRoles: ['customer']},
        requestRevision: {to: 'in_progress', allowedRoles: ['customer']},
    },
};

function computeNextMilestoneStatus(currentStatus, action, actorRole) {
    const stateTransitions = TRANSITIONS[currentStatus];
}