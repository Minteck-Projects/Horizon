"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure");
class ProtectedTags extends infrastructure_1.BaseService {
    all(projectId, options) {
        const pId = encodeURIComponent(projectId);
        return infrastructure_1.RequestHelper.get(this, `projects/${pId}/protected_tags`, options);
    }
    protect(projectId, tagName, options) {
        const pId = encodeURIComponent(projectId);
        return infrastructure_1.RequestHelper.post(this, `projects/${pId}/protected_tags`, Object.assign({ name: tagName }, options));
    }
    show(projectId, tagName) {
        const [pId, tName] = [projectId, tagName].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.get(this, `projects/${pId}/protected_tags/${tName}`);
    }
    unprotect(projectId, tagName) {
        const [pId, tName] = [projectId, tagName].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.delete(this, `projects/${pId}/protected_tags/${tName}`);
    }
}
exports.default = ProtectedTags;
