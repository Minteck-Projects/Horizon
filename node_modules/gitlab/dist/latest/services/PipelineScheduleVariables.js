"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure");
class PipelineScheduleVariables extends infrastructure_1.BaseService {
    all(projectId, pipelineScheduleId) {
        const [pId, psId] = [projectId, pipelineScheduleId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.get(this, `projects/${pId}/pipeline_schedules/${psId}/variables`);
    }
    create(projectId, pipelineScheduleId, options) {
        const [pId, psId] = [projectId, pipelineScheduleId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.post(this, `projects/${pId}/pipeline_schedules/${psId}/variables`, options);
    }
    edit(projectId, pipelineScheduleId, keyId, options) {
        const [pId, psId, kId] = [projectId, pipelineScheduleId, keyId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.put(this, `projects/${pId}/pipeline_schedules/${psId}/variables/${kId}`, options);
    }
    show(projectId, pipelineScheduleId, keyId) {
        const [pId, psId, kId] = [projectId, pipelineScheduleId, keyId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.get(this, `projects/${pId}/pipeline_schedules/${psId}/variables/${kId}`);
    }
    remove(projectId, pipelineScheduleId, keyId) {
        const [pId, psId, kId] = [projectId, pipelineScheduleId, keyId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.delete(this, `projects/${pId}/pipeline_schedules/${psId}/variables/${kId}`);
    }
}
exports.default = PipelineScheduleVariables;
