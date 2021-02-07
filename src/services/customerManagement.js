import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/customer/s', params);
}

/* 获取所属组织数据 */
export async function getOrganizationInfo(params) {
    return http.post('/uaa/w/organization', params);
}

/* 获取行业类型数据 */
export async function getIndustryTypeList(params) {
    return http.post(`/bioec/w/dictionaryItem/list/${params.code}`);
}

/* 获取区域数据 */
export async function getAreaInfo(params) {
    return http.get('/bioec/w/area/list', params);
}

// 新增
export async function addTable(params) {
    return http.post('/bioec/w/customer', params, 'body');
}

// 编辑
export async function editTableInfo(params) {
    return http.put(`/bioec/w/customer/${params.id}`, params, 'body');
}

// 详情
export async function getDetailRecord(params) {
    return http.get(`/bioec/w/customer/${params.id}`);
}

// 删除
export async function deleteTable(params) {
    return http.delete(`/bioec/w/customer/${params.id}`);
}
