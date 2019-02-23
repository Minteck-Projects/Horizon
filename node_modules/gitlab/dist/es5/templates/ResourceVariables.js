"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var infrastructure_1 = require("../infrastructure");
var ResourceVariables = /** @class */ (function (_super) {
    __extends(ResourceVariables, _super);
    function ResourceVariables(resourceType, baseParams) {
        var _this = _super.call(this, baseParams) || this;
        _this.resourceType = resourceType;
        return _this;
    }
    ResourceVariables.prototype.all = function (resourceId) {
        var rId = encodeURIComponent(resourceId);
        return infrastructure_1.RequestHelper.get(this, this.resourceType + "/" + rId + "/variables");
    };
    ResourceVariables.prototype.create = function (resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return infrastructure_1.RequestHelper.post(this, this.resourceType + "/" + rId + "/variables", options);
    };
    ResourceVariables.prototype.edit = function (resourceId, keyId, options) {
        var _a = [resourceId, keyId].map(encodeURIComponent), rId = _a[0], kId = _a[1];
        return infrastructure_1.RequestHelper.put(this, this.resourceType + "/" + rId + "/variables/" + kId, options);
    };
    ResourceVariables.prototype.show = function (resourceId, keyId) {
        var _a = [resourceId, keyId].map(encodeURIComponent), rId = _a[0], kId = _a[1];
        return infrastructure_1.RequestHelper.get(this, this.resourceType + "/" + rId + "/variables/" + kId);
    };
    ResourceVariables.prototype.remove = function (resourceId, keyId) {
        var _a = [resourceId, keyId].map(encodeURIComponent), rId = _a[0], kId = _a[1];
        return infrastructure_1.RequestHelper.delete(this, this.resourceType + "/" + rId + "/variables/" + kId);
    };
    return ResourceVariables;
}(infrastructure_1.BaseService));
exports.default = ResourceVariables;
