var $c5L0i$express = require("express");
var $c5L0i$bodyparser = require("body-parser");
var $c5L0i$simpleoauth2 = require("simple-oauth2");
var $c5L0i$dotenv = require("dotenv");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}






(0, ($parcel$interopDefault($c5L0i$dotenv))).config();
const $ce487c6e3030a219$var$config = {
    client: {
        id: process.env.APP_ID,
        secret: process.env.APP_SECRET
    },
    auth: {
        tokenHost: process.env.AUTH_HOST,
        tokenPath: '/open-apis/authen/v2/oauth/token'
    }
};
function $ce487c6e3030a219$export$596d806903d1f59e(req, res) {
    const code = req.body?.code || undefined;
    if (!code) return res.status(400).json({
        error: 'Authorization code is required'
    });
    const oauth2 = new (0, $c5L0i$simpleoauth2.AuthorizationCode)($ce487c6e3030a219$var$config);
    const tokenConfig = {
        code: code,
        redirect_uri: process.env.REDIRECT_URI
    };
    oauth2.getToken(tokenConfig).then((result)=>{
        console.log('Login Success');
        res.status(200).json(result);
    }).catch((error)=>{
        console.error('Login Error', error.data.payload);
        return res.status(500).json({
            error: 'Failed to login'
        });
    });
}
function $ce487c6e3030a219$export$c542b5e295206b2a(req, res) {
    console.log('Headers:', req.headers);
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    const { refresh_token: refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({
        error: 'Refresh token is required'
    });
    const oauth2 = new (0, $c5L0i$simpleoauth2.AuthorizationCode)($ce487c6e3030a219$var$config);
    const token = oauth2.createToken({
        refresh_token: refresh_token
    });
    token.refresh((error, result)=>{
        if (error) {
            console.error('Refresh Token Error', error.message);
            return res.status(500).json({
                error: 'Failed to refresh token'
            });
        }
        const { access_token: access_token, refresh_token: new_refresh_token, expires_in: expires_in } = result;
        res.status(200).json({
            access_token: access_token,
            refresh_token: new_refresh_token,
            expires_in: expires_in,
            token_type: 'Bearer'
        });
    });
}
function $ce487c6e3030a219$export$a0973bcfe11b05c9(req, res) {
    const { access_token: access_token } = req.body;
    if (!access_token) return res.status(400).json({
        error: 'Access token is required'
    });
    const oauth2 = new (0, $c5L0i$simpleoauth2.AuthorizationCode)($ce487c6e3030a219$var$config);
    const token = oauth2.createToken({
        access_token: access_token
    });
    token.revoke('access_token', (error)=>{
        if (error) {
            console.error('Logout Error', error.message);
            return res.status(500).json({
                error: 'Failed to logout'
            });
        }
        res.status(200).json({
            message: 'Successfully logged out'
        });
    });
}


const $a7f3433243898403$var$router = (0, ($parcel$interopDefault($c5L0i$express))).Router();
$a7f3433243898403$var$router.post('/login', (0, $ce487c6e3030a219$export$596d806903d1f59e));
$a7f3433243898403$var$router.post('/refresh-token', (0, $ce487c6e3030a219$export$c542b5e295206b2a));
$a7f3433243898403$var$router.post('/logout', (0, $ce487c6e3030a219$export$a0973bcfe11b05c9));
var $a7f3433243898403$export$2e2bcd8739ae039 = $a7f3433243898403$var$router;


const $43d7963e56408b24$var$app = (0, ($parcel$interopDefault($c5L0i$express)))();
const $43d7963e56408b24$var$port = process.env.PORT || 3000;
$43d7963e56408b24$var$app.use((0, ($parcel$interopDefault($c5L0i$bodyparser))).json());
$43d7963e56408b24$var$app.use((0, ($parcel$interopDefault($c5L0i$bodyparser))).urlencoded({
    extended: true
}));
$43d7963e56408b24$var$app.use('/api/v1/auth', (0, $a7f3433243898403$export$2e2bcd8739ae039));
$43d7963e56408b24$var$app.get('/api', (req, res)=>{
    return res.status(200).json({
        message: 'Welcome to Ztrans API'
    });
});
$43d7963e56408b24$var$app.listen($43d7963e56408b24$var$port, ()=>{
    console.log(`Server running on port ${$43d7963e56408b24$var$port}`);
});
$43d7963e56408b24$var$app.use((req, res, next)=>{
    console.log(`Unhandled request: ${req.method} ${req.url}`);
    next();
});


//# sourceMappingURL=index.js.map
