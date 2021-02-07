import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/series/search', params);
}

// 新增
export async function addTable(params) {
    return http.post('/bioec/w/series', params, 'body');
}

// 编辑
export async function editTableInfo(params) {
    return http.put('/bioec/w/series/{id}', params, 'body');
}

// 详情
export async function getDetailRecord(params) {
    return http.get(`/bioec/w/series/${params}`);
}

// 删除
export async function deleteTable(params) {
    return http.delete('/bioec/w/series/{id}', params);
}

/* 上移 */
export async function up(params) {
    return http.put(`/bioec/w/series/moveUp/${params.id}`);
}

/* 下移 */
export async function down(params) {
    return http.put(`/bioec/w/series/moveDown/${params.id}`);
}