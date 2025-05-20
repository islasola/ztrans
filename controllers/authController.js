import { AuthorizationCode } from 'simple-oauth2';
import { config } from '../config/oauthConfig';

import { get_jsapi_ticket, sign_jsapi_ticket } from '../utils/jsapiTicket';

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

export function signature(req, res) {
    const url = req.body?.url || undefined;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const jsapi_ticket = req.session.jsapi_ticket;
    const data = sign_jsapi_ticket(jsapi_ticket, url);

    // Send a secure response to the client without sensitive data
    res.status(200).json({
        message: 'Signature generated successfully',
        data: data,
    });
}