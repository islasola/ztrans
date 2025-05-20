import { config } from '../config/oauthConfig';
import sha1 from 'sha1'

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

export function sign_jsapi_ticket (jsapi_ticket, url) {
    const timestamp = parseInt(Date.now() / 1000);
    const noncestr = Math.random().toString(36).substr(2, 15);
    const signature = sha1(
        `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
    );
    return {
        timestamp,
        noncestr,
        signature,
    };
}