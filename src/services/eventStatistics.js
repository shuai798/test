import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    // if(params){
    //     if(params.areaCode)
    // }
    return http.get('/bioec/w/deviceEventStatistics/eventNumStatisticsPageData', params);
}

/* 获取总体统计数据 */
export async function getTotalNumStatisticsData(params) {
    return http.get('/bioec/w/deviceEventStatistics/totalNumStatistics', params);
}

/* 获取待处理已处理事件 */
export async function statisticsByType(params) {
    return http.get('/bioec/w/deviceEventStatistics/statisticsByType', params);
}

/* 获取设备接入趋势数据 */
export async function eventNumStatisticsTrendChartData(params) {
    return http.get('/bioec/w/deviceEventStatistics/eventNumStatisticsTrendChartData', params);
}
