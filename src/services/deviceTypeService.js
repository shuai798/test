import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/statisticsSeries/s', params);
}

/* 获取详情数据 */
export async function getDeviceTop30(params) {
    return http.get('/bioec/w/statisticsSeries/top30', params);
}
