import http from '../utils/request';

export async function getDeviceAssignmentList(params) {
    return http.post('/bioec/w/device/allocation/s', params);
}

export async function getDeviceAssignmentDetail(params) {
    return http.get('/bioec/w/device/allocation/{id}', params);
}

export async function batchAddDeviceAssignment(params) {
    return http.post('/bioec/w/device/allocation', params, 'body');
}

export async function updateDeviceAssignment(params) {
    return http.put('/bioec/w/device/allocation/upt', params, 'body');
}

export async function batchUpdateDeviceAssignment(params) {
    return http.put('/bioec/w/device/allocation/bulkAllocation', params, 'body');
}

export async function batchDeleteTableInfo(params) {
    return http.delete('/bioec/w/device/allocation/bulkDel', params, 'body');
}

export async function checkImportFile(params) {
    return http.post('/bioec/w/device/allocation/checkImportFile', params, 'body');
}

export async function importAssignment(params) {
    return http.post('/bioec/w/device/allocation/import', params, 'body');
}

export async function getSeriesTree() {
    return http.post('/bioec/w/series/s');
}

export async function getCustomerList() {
    return http.get('/bioec/w/device/allocation/getCustomerAndSubOrg');
}

export async function getDeviceNoListBySeriesId(params) {
    return http.get('/bioec/w/deviceNo/findBySeries', params);
}

export async function unbind(params) {
    return http.put('/bioec/w/device/{id}/unbind', params);
}
