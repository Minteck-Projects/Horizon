"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("request-promise-core/errors");
const util_1 = require("util");
const xhr_1 = __importDefault(require("xhr"));
const RequestHelper_1 = require("./RequestHelper");
function promisifyWithRetry(fn) {
    const promisifiedFn = util_1.promisify(fn);
    return function getResponse(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield promisifiedFn(opts);
            const sleepTime = parseInt(response.headers['retry-after'], 10);
            if (response.statusCode === 429 && sleepTime) {
                yield RequestHelper_1.wait(sleepTime * 1000);
            }
            else if (response.statusCode >= 400 && response.statusCode <= 599) {
                throw new errors_1.StatusCodeError(response.statusCode, response.body, {}, null);
            }
            return opts.resolveWithFullResponse ? response : response.body;
        });
    };
}
const promisifyWithRetryDelete = promisifyWithRetry(xhr_1.default.del);
const XMLHttpRequesterPromisifiedExtras = {
    del: promisifyWithRetryDelete,
    delete: promisifyWithRetryDelete,
    get: promisifyWithRetry(xhr_1.default.get),
    head: promisifyWithRetry(xhr_1.default.head),
    patch: promisifyWithRetry(xhr_1.default.patch),
    post: promisifyWithRetry(xhr_1.default.post),
    put: promisifyWithRetry(xhr_1.default.put),
};
const XMLHttpRequester = Object.assign(promisifyWithRetry(xhr_1.default), XMLHttpRequesterPromisifiedExtras);
exports.default = XMLHttpRequester;
