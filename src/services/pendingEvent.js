import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/deviceEvent/unhandledEvents', params);
}

// 详情
export async function getDetailRecord(params) {
    return http.get('/bioec/w/deviceEvent/{id}', params);
}

// 处理
export async function dispose(params) {
    return http.post('/bioec/w/deviceEvent/bulkHandle', params, 'body');
}

// 获取地理位置
export async function getLocationData(params) {
    return http.get('/bioec/w/area/cityTree', params);
}
