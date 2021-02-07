import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.get('/bioec/w/statisticsBreakdown/trendPageData', params);
}

/* 故障类型 */
export async function getTroubleTypeList(params) {
    return http.get('/bioec/w/statisticsBreakdown/statisticsByTypePageData', params);
}

/* 故障型号 */
export async function getTroubleModelList(params) {
    return http.get('/bioec/w/statisticsBreakdown/statisticsBySeriesPageData', params);
}

/* 获取总体统计数据 */
export async function getTotalNumStatisticsData(params) {
    return http.get('/bioec/w/statisticsBreakdown/totalNum', params);
}

/* 故障类型 */
export async function statisticsByType(params) {
    return http.get('/bioec/w/statisticsBreakdown/statisticsByType', params);
}

/* 故障型号 */
export async function statisticsBySeries(params) {
    return http.get('/bioec/w/statisticsBreakdown/statisticsBySeries', params);
}

/* 获取通行趋势数据 */
export async function eventNumStatisticsTrendChartData(params) {
    return http.get('/bioec/w/statisticsBreakdown/trendData', params);
}
