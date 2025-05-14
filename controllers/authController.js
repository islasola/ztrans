import { AuthorizationCode } from 'simple-oauth2';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    client: {
        id: process.env.APP_ID,
        secret: process.env.APP_SECRET,
    },
    auth: {
        tokenHost: process.env.AUTH_HOST,
        tokenPath: '/open-apis/authen/v2/oauth/token'
    },
};

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
       .then((result) => {
            console.log('Login Success');
            res.status(200).json(result);
        })
       .catch((error) => {
            console.error('Login Error', error.data.payload);
            return res.status(500).json({ error: 'Failed to login' });
       });
}

export function refreshToken(req, res) {
    console.log('Headers:', req.headers);
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    const oauth2 = new AuthorizationCode(config);
    const token = oauth2.createToken({ refresh_token });

    token.refresh((error, result) => {
        if (error) {
            console.error('Refresh Token Error', error.message);
            return res.status(500).json({ error: 'Failed to refresh token' });
        }

        const { access_token, refresh_token: new_refresh_token, expires_in } = result;
        res.status(200).json({
            access_token,
            refresh_token: new_refresh_token,
            expires_in,
            token_type: 'Bearer'
        });
    });
}

export function logout(req, res) {
    const { access_token } = req.body;
    if (!access_token) {
        return res.status(400).json({ error: 'Access token is required' });
    }

    const oauth2 = new AuthorizationCode(config);
    const token = oauth2.createToken({ access_token });

    token.revoke('access_token', (error) => {
        if (error) {
            console.error('Logout Error', error.message);
            return res.status(500).json({ error: 'Failed to logout' });
        }

        res.status(200).json({ message: 'Successfully logged out' });
    });
}