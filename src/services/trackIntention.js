import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/intentionTracking/s', params);
}

// 详情
export async function getDetailRecord(params) {
    return http.get('/bioec/w/intentionTracking/{id}', params);
}

// 跟踪
export async function trace(params) {
    return http.post('/bioec/w/intentionTracking/trace/{id}', params);
}
