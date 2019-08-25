"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Bundler(services) {
    const combined = Object.assign({}, services);
    return class Bundle {
        constructor(baseOptions) {
            Object.keys(combined).forEach((serviceName) => {
                this[serviceName] = new combined[serviceName](baseOptions);
            });
        }
    };
}
exports.default = Bundler;
