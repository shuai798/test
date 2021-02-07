import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/userOperLog/s', params);
}

/* 获取操作日志操作类型 */
export async function getTypes() {
    return http.get('/bioec/w/userOperLog/types');
}
