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
var PipelineScheduleVariables = /** @class */ (function (_super) {
    __extends(PipelineScheduleVariables, _super);
    function PipelineScheduleVariables() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PipelineScheduleVariables.prototype.all = function (projectId, pipelineScheduleId) {
        var _a = [projectId, pipelineScheduleId].map(encodeURIComponent), pId = _a[0], psId = _a[1];
        return infrastructure_1.RequestHelper.get(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables");
    };
    PipelineScheduleVariables.prototype.create = function (projectId, pipelineScheduleId, options) {
        var _a = [projectId, pipelineScheduleId].map(encodeURIComponent), pId = _a[0], psId = _a[1];
        return infrastructure_1.RequestHelper.post(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables", options);
    };
    PipelineScheduleVariables.prototype.edit = function (projectId, pipelineScheduleId, keyId, options) {
        var _a = [projectId, pipelineScheduleId, keyId].map(encodeURIComponent), pId = _a[0], psId = _a[1], kId = _a[2];
        return infrastructure_1.RequestHelper.put(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables/" + kId, options);
    };
    PipelineScheduleVariables.prototype.show = function (projectId, pipelineScheduleId, keyId) {
        var _a = [projectId, pipelineScheduleId, keyId].map(encodeURIComponent), pId = _a[0], psId = _a[1], kId = _a[2];
        return infrastructure_1.RequestHelper.get(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables/" + kId);
    };
    PipelineScheduleVariables.prototype.remove = function (projectId, pipelineScheduleId, keyId) {
        var _a = [projectId, pipelineScheduleId, keyId].map(encodeURIComponent), pId = _a[0], psId = _a[1], kId = _a[2];
        return infrastructure_1.RequestHelper.delete(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables/" + kId);
    };
    return PipelineScheduleVariables;
}(infrastructure_1.BaseService));
exports.default = PipelineScheduleVariables;
