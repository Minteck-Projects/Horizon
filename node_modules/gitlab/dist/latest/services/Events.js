"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure");
const ACTION_TYPES = {
    created: 'created',
    updated: 'updated',
    closed: 'closed',
    reopened: 'reopened',
    pushed: 'pushed',
    commented: 'commented',
    merged: 'merged',
    joined: 'joined',
    left: 'left',
    destroyed: 'destroyed',
    expired: 'expired',
};
const TARGET_TYPES = {
    issue: 'issue',
    milestone: 'milestone',
    merge_request: 'merge_request',
    note: 'note',
    project: 'project',
    snippet: 'snippet',
    user: 'user',
};
function assertEventOptions(action, target) {
    if (action && !(action in ACTION_TYPES)) {
        throw new Error(`This action is not supported. Pleased use one of following options: ${Object.keys(ACTION_TYPES)}`);
    }
    if (target && !(target in TARGET_TYPES)) {
        throw new Error(`This target is not supported. Pleased use one of following options: ${Object.keys(TARGET_TYPES)}`);
    }
}
exports.assertEventOptions = assertEventOptions;
class Events extends infrastructure_1.BaseService {
    all(options) {
        assertEventOptions(options.action, options.targetType);
        return infrastructure_1.RequestHelper.get(this, 'events', options);
    }
}
exports.default = Events;
