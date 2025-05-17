import dotenv from 'dotenv';

dotenv.config();

export const config = {
    client: {
        id: process.env.APP_ID,
        secret: process.env.APP_SECRET,
    },
    auth: {
        tokenHost: process.env.AUTH_HOST,
        tokenPath: '/open-apis/authen/v2/oauth/token'
    },
};