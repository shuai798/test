import http from '../utils/request';

/* 获取数据字典分页数据 */
export async function getTableList(params) {
    return http.post('/bioec/w/dictionaryType/s', params);
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
    return http.post('/bioec/w/dictionaryItem', params, 'body');
}

/* 配置中编辑 */
export async function editSettingItem(params) {
    return http.put('/bioec/w/dictionaryItem/{id}', params, 'body');
}

/* 配置中删除 */
export async function deleteSettingItem(params) {
    return http.delete('/bioec/w/dictionaryItem/{id}', params);
}

/* 是否可用切换 */
export async function changeSettingItemStatus(params) {
    return http.post('/bioec/w/dictionaryItem/available/{id}', params);
}

/* 上移 */
export async function up(params) {
    return http.post('/bioec/w/dictionaryItem/up/{id}', params);
}

/* 下移 */
export async function down(params) {
    return http.post('/bioec/w/dictionaryItem/down/{id}', params);
}

/* 检查配置项中枚举项名称是否重复 */
export async function checkSettingName(params) {
    return http.post('/bioec/w/dictionaryItem/name', params);
}

/* 检查配置项中枚举项code是否重复 */
export async function checkEnumCode(params) {
    return http.post('/bioec/w/dictionaryItem/code', params);
}

/* 获取行业类型数据 */
export async function getDictionaryItemList(params) {
    return http.post('/bioec/w/dictionaryItem/list', params);
}
