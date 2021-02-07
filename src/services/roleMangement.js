import http from '../utils/request';

/* 获取数据字典分页数据 */
export async function getTableList(params) {
    return http.post('/uaa/w/role/s', params);
}

/* 检查数据字典名字是否重复 */
export async function checkDataDictionaryName(params) {
    return http.post('/bioec/w/dictionaryType/name/{id}', params);
}

/* 编辑数据字典 */
export async function editDataDictionaryItem(params) {
    return http.put('/bioec/w/dictionaryType/{id}', params, 'body');
}

/* 获取配置中的分页数据 */
export async function getSettingDataDictionaryList(params) {
    return http.post('/bioec/w/dictionaryItem/s', params);
}

/* 配置中新增 */
export async function addSettingItem(params) {
    return http.post('/uaa/w/role', params, 'body');
}

/* 配置中编辑 */
export async function editSettingItem(params) {
    return http.put('/uaa/w/role/{id}', params, 'body');
}

//详情
export async function getDetailRecord(params) {
    return http.get('/uaa/w/role/{id}', params);
}

/* 配置中删除 */
export async function deleteSettingItem(params) {
    return http.delete('/uaa/w/role/{id}', params);
}
