"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure");
class UserImpersonationTokens extends infrastructure_1.BaseService {
    all(userId) {
        const uId = encodeURIComponent(userId);
        return infrastructure_1.RequestHelper.get(this, `users/${uId}/impersonation_tokens`);
    }
    /**
     * It creates a new impersonation token. Note that only administrators can do this.
     * You are only able to create impersonation tokens to impersonate the user and perform
     * both API calls and Git reads and writes. The user will not see these tokens
     * in their profile settings page.
     * @param userId UserId
     * @param name The name of the impersonation token
     * @param scopes The array of scopes of the impersonation token (api, read_user)
     * @param expiresAt The expiration date of the impersonation token in ISO format (YYYY-MM-DD)
     */
    add(userId, name, scopes, expiresAt) {
        const uId = encodeURIComponent(userId);
        return infrastructure_1.RequestHelper.post(this, `users/${uId}/impersonation_tokens`, {
            name,
            expiresAt,
            scopes,
        });
    }
    show(userId, tokenId) {
        const [uId, tId] = [userId, tokenId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.get(this, `users/${uId}/impersonation_tokens/${tId}`);
    }
    revoke(userId, tokenId) {
        const [uId, tId] = [userId, tokenId].map(encodeURIComponent);
        return infrastructure_1.RequestHelper.delete(this, `users/${uId}/impersonation_tokens/${tId}`);
    }
}
exports.default = UserImpersonationTokens;
