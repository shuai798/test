import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/deviceBreakdownRecord/s', params);
    // return http.post('/bioec/w/deviceBreakdownRecord/s', params, 'body');
}

/* 获取详情数据 */
export async function getDetailList(params) {
    return http.get('/bioec/w/deviceBreakdownRecord/{id}', params);
}
