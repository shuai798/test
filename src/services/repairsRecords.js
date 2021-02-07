import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/deviceRepairRecord/s', params);
}

// 详情
export async function getDetailRecord(params) {
    return http.get('/bioec/w/deviceRepairRecord/{id}', params);
}
