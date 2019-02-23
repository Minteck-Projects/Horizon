"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_join_1 = __importDefault(require("url-join"));
var request_promise_1 = __importDefault(require("request-promise"));
var XMLHttpRequester_1 = __importDefault(require("./XMLHttpRequester"));
var BaseModel = /** @class */ (function () {
    function BaseModel(_a) {
        var token = _a.token, oauthToken = _a.oauthToken, sudo = _a.sudo, _b = _a.url, url = _b === void 0 ? 'https://gitlab.com' : _b, _c = _a.useXMLHttpRequest, useXMLHttpRequest = _c === void 0 ? false : _c, _d = _a.version, version = _d === void 0 ? 'v4' : _d, _e = _a.rejectUnauthorized, rejectUnauthorized = _e === void 0 ? true : _e;
        this.url = url_join_1.default(url, 'api', version);
        this.headers = {};
        this.requester = useXMLHttpRequest
            ? XMLHttpRequester_1.default : request_promise_1.default;
        this.useXMLHttpRequest = useXMLHttpRequest;
        this.rejectUnauthorized = rejectUnauthorized;
        // Handle auth tokens
        if (oauthToken)
            this.headers.authorization = "Bearer " + oauthToken;
        else if (token)
            this.headers['private-token'] = token;
        // Set sudo
        if (sudo)
            this.headers['Sudo'] = sudo;
    }
    return BaseModel;
}());
exports.default = BaseModel;
