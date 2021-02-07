import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    // if(params){
    //     if(params.areaCode)
    // }
    return http.get('/bioec/w/customerDistribution/getProjectCountAndAccessDeviceCountByCity', params);
}

/* 获取行业统计数据 */
export async function getIndustryListInfo(params) {
    // if(params){
    //     if(params.areaCode)
    // }
    return http.get('/bioec/w/customerDistribution/getIndustryDistribution', params);
}

/* 获取客户数量、项目数量、销售设备数 */
export async function getCountInfo(params) {
    return http.get('/bioec/w/customerDistribution/getCountInfo', params);
}

/* 获取客户数量、项目数量、销售设备数 */
export async function getIndustryDistributionOverview(params) {
    return http.get('/bioec/w/customerDistribution/getIndustryDistributionOverview', params);
}

/* 获取客户数量、项目数量、销售设备数 */
export async function getIndustryDistributionWhole(params) {
    return http.get('/bioec/w/customerDistribution/getIndustryDistributionWhole', params);
}

/* 获取项目数量分布 */
export async function getProjectCountAndAccessDeviceCountByProvince(params) {
    return http.get('/bioec/w/customerDistribution/getProjectCountAndAccessDeviceCountByProvince', params);
}

/* 获取项目数量分布 */
export async function getStaffSizeDistributionList(params) {
    return http.get('/bioec/w/customerDistribution/getStaffSizeDistributionList', params);
}
