import http from '../utils/request';
import Api from '../utils/api';

export async function loginOauth(params) {
    return http.post('/oauth/token', params, 'form-data');
}

export async function authMe(params) {
    return http.get('/uaa/w/auth/me', params);
}

export async function authClients() {
    return http.get('/uaa/w/auth/clients');
}

export async function menuList() {
    return http.get('/uaa/w/auth/authority');
}

export async function downloadUrl() {
    return http.get('/bioec/w/common/downloadUrl');
}
