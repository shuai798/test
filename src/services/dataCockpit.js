import http from '../utils/request';

/* 获取数据字典分页数据 */
export async function getCustomerIndustryTop5(params) {
    return http.get('/bioec/w/dataCockpit/list/customerIndustryTop5', params);
}

/* 获取实时事件 */
export async function getEventList(params) {
    return http.get('/bioec/w/deviceBreakdownRecord/listView', params);
}

/* 获取实时事件 */
export async function getDeviceRest(params) {
    return http.get('/bioec/w/deviceStatistics/deviceRemainingRunningTimesList', params);
}
