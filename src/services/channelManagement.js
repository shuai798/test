import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/customerPath/s', params);
}

// 获取所有项目
export async function getAllProjectList(params) {
    return http.get(`/bioec/w/customerProject/list/${params.id}`);
}

// 新增
export async function addTable(params) {
    return http.post('/bioec/w/customerPath', params, 'body');
}

// 编辑
export async function editTableInfo(params) {
    return http.put(`/bioec/w/customerPath/${params.id}`, params, 'body');
}

// 详情
export async function getDetailRecord(params) {
    return http.get(`/bioec/w/customerPath/${params.id}`);
}

// 删除
export async function deleteTable(params) {
    return http.delete(`/bioec/w/customerPath/${params}`);
}