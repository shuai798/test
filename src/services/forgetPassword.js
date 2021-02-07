import http from '../utils/request';

export async function checkMobile(params) {
    return http.get('/uaa/w/user/checkMobile', params);
}

export async function sendCode(params) {
    return http.post('/message/verification/send', params, 'body');
}

export async function checkCode(params) {
    return http.post('/message/verification/check', params, 'body');
}
export async function changePassword(params) {
    return http.post('/uaa/w/user/password/set/{mobile}', params);
}