import http from '../utils/request';

export async function getPersonalInformationDetail() {
    return http.get('/bioec/w/common/personal');
}

export async function updateName(params) {
    return http.post('/uaa/w/user/name/update/{mobile}/{realName}', params);
}

export async function resetPassword(params) {
    return http.post('/uaa/w/user/password/set/{mobile}', params);
}

export async function updatePhone(params) {
    return http.post('/uaa/w/user/mobile/update/{mobile}/{newMobile}', params);
}

export async function updatePhoto(params) {
    return http.post('/uaa/w/user/photos/update/{mobile}', params, 'body');
}
