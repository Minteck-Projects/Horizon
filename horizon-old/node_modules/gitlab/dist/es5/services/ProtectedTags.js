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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var infrastructure_1 = require("../infrastructure");
var ProtectedTags = /** @class */ (function (_super) {
    __extends(ProtectedTags, _super);
    function ProtectedTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProtectedTags.prototype.all = function (projectId, options) {
        var pId = encodeURIComponent(projectId);
        return infrastructure_1.RequestHelper.get(this, "projects/" + pId + "/protected_tags", options);
    };
    ProtectedTags.prototype.protect = function (projectId, tagName, options) {
        var pId = encodeURIComponent(projectId);
        return infrastructure_1.RequestHelper.post(this, "projects/" + pId + "/protected_tags", __assign({ name: tagName }, options));
    };
    ProtectedTags.prototype.show = function (projectId, tagName) {
        var _a = [projectId, tagName].map(encodeURIComponent), pId = _a[0], tName = _a[1];
        return infrastructure_1.RequestHelper.get(this, "projects/" + pId + "/protected_tags/" + tName);
    };
    ProtectedTags.prototype.unprotect = function (projectId, tagName) {
        var _a = [projectId, tagName].map(encodeURIComponent), pId = _a[0], tName = _a[1];
        return infrastructure_1.RequestHelper.delete(this, "projects/" + pId + "/protected_tags/" + tName);
    };
    return ProtectedTags;
}(infrastructure_1.BaseService));
exports.default = ProtectedTags;
