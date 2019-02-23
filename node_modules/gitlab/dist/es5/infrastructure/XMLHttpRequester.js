"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("request-promise-core/errors");
var util_1 = require("util");
var xhr_1 = __importDefault(require("xhr"));
var RequestHelper_1 = require("./RequestHelper");
function promisifyWithRetry(fn) {
    var promisifiedFn = util_1.promisify(fn);
    return function getResponse(opts) {
        return __awaiter(this, void 0, void 0, function () {
            var response, sleepTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promisifiedFn(opts)];
                    case 1:
                        response = _a.sent();
                        sleepTime = parseInt(response.headers['retry-after'], 10);
                        if (!(response.statusCode === 429 && sleepTime)) return [3 /*break*/, 3];
                        return [4 /*yield*/, RequestHelper_1.wait(sleepTime * 1000)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (response.statusCode >= 400 && response.statusCode <= 599) {
                            throw new errors_1.StatusCodeError(response.statusCode, response.body, {}, null);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, opts.resolveWithFullResponse ? response : response.body];
                }
            });
        });
    };
}
var promisifyWithRetryDelete = promisifyWithRetry(xhr_1.default.del);
var XMLHttpRequesterPromisifiedExtras = {
    del: promisifyWithRetryDelete,
    delete: promisifyWithRetryDelete,
    get: promisifyWithRetry(xhr_1.default.get),
    head: promisifyWithRetry(xhr_1.default.head),
    patch: promisifyWithRetry(xhr_1.default.patch),
    post: promisifyWithRetry(xhr_1.default.post),
    put: promisifyWithRetry(xhr_1.default.put),
};
var XMLHttpRequester = Object.assign(promisifyWithRetry(xhr_1.default), XMLHttpRequesterPromisifiedExtras);
exports.default = XMLHttpRequester;
