import { config } from '../config/oauthConfig';

export async function get_jsapi_ticket(access_token) {
    const url = `${process.env.AUTH_HOST}/open-apis/jssdk/ticket/get`;
    const headers = {
        Authorization: `Bearer ${access_token}`,
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        return data.ticket;
    } catch (error) {
        return console.error(error);
    }
}