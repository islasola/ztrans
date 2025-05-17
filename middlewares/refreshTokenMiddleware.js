import { AuthorizationCode } from 'simple-oauth2';
import { config } from '../config/oauthConfig';
import { get_jsapi_ticket } from '../utils/jsapiTicket';

export async function refreshTokenMiddleware(req, res, next) {
    if (!req.session || !req.session.access_token || !req.session.expires_at) {
        return next();
    }

    const access_token = req.session.access_token;
    const refresh_token = req.session.refresh_token;
    const expires_at = req.session.expires_at;

    if (expires_at < Date.now()) {
        // Access token expired, try to refresh it
        if (refresh_token) {
            const oauth2 = new AuthorizationCode(config);
            const token = oauth2.createToken({ refresh_token });

            try {
                const result = await token.refresh();
                console.log('Refresh Token Success');

                const new_access_token = result.access_token;
                const new_expires_at = Date.now() + result.expires_in * 1000;
                const new_refresh_token = result.refresh_token;
                const new_refresh_token_expires_at = Date.now() + result.refresh_token_expires_in * 1000;

                // Update session with new tokens and expiration times
                req.session.access_token = new_access_token;
                req.session.jsapi_ticket = await get_jsapi_ticket(new_access_token);
                req.session.refresh_token = new_refresh_token;
                req.session.expires_at = new_expires_at;
                req.session.refresh_token_expires_at = new_refresh_token_expires_at;
            } catch (error) {
                console.error('Refresh Token Error', error.data.payload);
                return res.status(500).json({ error: 'Failed to refresh token' });
            }
        } else {
            console.error('Refresh token expired or not available');
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    next();
}