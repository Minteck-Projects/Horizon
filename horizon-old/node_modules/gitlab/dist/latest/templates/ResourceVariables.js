"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure");
class ResourceVariables extends infrastructure_1.BaseService {
    constructor(resourceType, baseParams) {
        super(baseParams);
        this.resourceType = resourceType;
    }
    all(resourceId) {
        const rId = encodeURIComponent(resourceId);
        return infrastructure_1.RequestHelper.get(this, `${this.resourceType}/${rId}/variables`);
    }
    create(resourceId, options) {
        const rId = encodeURIComponent(resourceId);
        return infrastructure_1.RequestHelper.post(this, `${this.resourceType}/${rId}/variables`, options);
    }
    edit(resourceId, keyId, options) {
        const [rId, kId] = [resourceId, keyId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.put(this, `${this.resourceType}/${rId}/variables/${kId}`, options);
    }
    show(resourceId, keyId) {
        const [rId, kId] = [resourceId, keyId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.get(this, `${this.resourceType}/${rId}/variables/${kId}`);
    }
    remove(resourceId, keyId) {
        const [rId, kId] = [resourceId, keyId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.delete(this, `${this.resourceType}/${rId}/variables/${kId}`);
    }
}
exports.default = ResourceVariables;
