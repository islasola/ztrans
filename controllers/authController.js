import { AuthorizationCode } from 'simple-oauth2';
import { config } from '../config/oauthConfig';

import { get_jsapi_ticket } from '../utils/jsapiTicket';

export function login(req, res) {
    const code = req.body?.code || undefined;
    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    const oauth2 = new AuthorizationCode(config);
    const tokenConfig = {
        code,
        redirect_uri: process.env.REDIRECT_URI,
    };

    oauth2.getToken(tokenConfig)
       .then(async (result) => {
            console.log('Login Success');
            const { access_token, refresh_token, scope } = result;
            const expires_at = Date.now() + result.expires_in * 1000;
            const refresh_token_expires_at = Date.now() + result.refresh_token_expires_in * 1000;
            const jsapi_ticket = await get_jsapi_ticket(access_token);
            
            // Store access_token, jsapi_ticket, refresh_token, and their respective expiration times in the session
            req.session.access_token = access_token;
            req.session.jsapi_ticket = jsapi_ticket;
            req.session.refresh_token = refresh_token;
            req.session.expires_at = expires_at;
            req.session.refresh_token_expires_at = refresh_token_expires_at;
            req.session.scope = scope;

            // Refresh token if necessary
            await refreshTokenIfNeeded(req);

            // Send a secure response to the client without sensitive data
            const sessionId = req.sessionID;
            res.status(200).json({
                message: 'Login Successful',
                sessionId: sessionId,
            });
        })
       .catch((error) => {
            console.error('Login Error', error.data.payload);
            return res.status(500).json({ error: 'Failed to login' });
       });
}

export function logout(req, res) {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Logout Error', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        console.log('Logout Success');
        res.status(200).json({ message: 'Successfully logged out' });
    });
}


// Function to refresh token if necessary
async function refreshTokenIfNeeded(req) {
    const access_token = req.session.access_token;
    const refresh_token = req.session.refresh_token;
    const expires_at = req.session.expires_at;
    const refresh_token_expires_at = req.session.refresh_token_expires_at;

    if (access_token && expires_at < Date.now()) {
        // Access token expired, try to refresh it
        if (refresh_token && refresh_token_expires_at > Date.now()) {
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
                throw new Error('Failed to refresh token');
            }
        } else {
            console.error('Refresh token expired or not available');
            throw new Error('Refresh token expired or not available');
        }
    }
}
