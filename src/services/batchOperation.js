import http from '../utils/request';

/* 获取分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/batchOperation/s', params);
}

/* 获取批量操作分页数据 */
export async function getBatchOperationList(params) {
    return http.post('/bioec/w/batchOperation/device/s', params);
}

/* 获取详情分页数据 */
export async function getDetaiTablelList(params) {
    return http.post('/bioec/w/batchOperation/operatedDevice/s', params);
}

/* 获取详情数据 */
export async function getDetaiList(params) {
    return http.get('/bioec/w/batchOperation/{id}', params);
}

/* 获取分页数据 */
export async function addBatchOperation(params) {
    return http.post('/bioec/w/batchOperation', params, 'body');
}

/* 再次下发 */
export async function issuedAgain(params) {
    return http.put('/bioec/w/batchOperation/reIssue/{operationDeviceId}', params);
}

/* 批量下发 */
export async function batchIssuedAgain(params) {
    return http.put('/bioec/w/batchOperation/batchReIssue/{id}', params);
}

/* 获取目标版本 */
export async function getDestVersion(params) {
    return http.get('/bioec/w/series/{id}/destVersion/list', params);
}

export async function getDictionaryItemList(params) {
    return http.post('/bioec/w/dictionaryItem/list/{code}', params);
}
