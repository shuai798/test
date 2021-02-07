import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    // if(params){
    //     if(params.areaCode)
    // }
    return http.get('/bioec/w/deviceStatistics/accessTrendPageData', params);
}

/* 获取总体统计数据 */
export async function deviceStatisticsTotalData(params) {
    return http.get('/bioec/w/deviceStatistics/deviceStatisticsTotalData', params);
}

/* 获取总体统计数据 */
export async function customerIndustryTop5(params) {
    return http.get('/bioec/w/deviceStatistics/deviceSeriesData', params);
}

/* 获取总体统计数据 */
export async function deviceStatusData(params) {
    return http.get('/bioec/w/deviceStatistics/deviceStatusData', params);
}

/* 获取设备接入趋势数据 */
export async function accessTrendChartData(params) {
    return http.get('/bioec/w/deviceStatistics/accessTrendChartData', params);
}
