import http from '../utils/request';

export async function getDeviceList(params) {
    return http.post('/bioec/w/device/s', params);
}

export async function getDeviceDetail(params) {
    return http.get('/bioec/w/device/{id}', params);
}

export async function unbind(params) {
    return http.put('/bioec/w/device/allocation/unbound/{id}', params);
}

export async function getParameterSettings(params) {
    return http.get('/bioec/w/device/{id}/param', params);
}

export async function editParameter(params) {
    return http.put('/bioec/w/device/{id}/param', params, 'body');
}

export async function editManagementStatus(params) {
    return http.put('/bioec/w/device/{id}/setManagementStatus', params, 'body');
}

export async function getExceptionRecordList(params) {
    return http.post('/bioec/w/deviceAbnormalRecord/s', params);
}

export async function getExceptionRecordDetail(params) {
    return http.get('/bioec/w/deviceAbnormalRecord/{id}', params);
}

export async function getBrokenRecordList(params) {
    delete params.breakdownTime;
    return http.post('/bioec/w/deviceBreakdownRecord/s', params);
}

export async function getBrokenRecordDetail(params) {
    return http.get('/bioec/w/deviceBreakdownRecord/{id}', params);
}

export async function getInformationReleaseList(params) {
    return http.post('/bioec/w/deviceInformationPublish/s', params);
}

export async function removeFile(params) {
    return http.delete('/fileservice/w/fileManage/delete/{id}', params);
}

export async function removeFileByFileId(params) {
    return http.delete('/fileservice/w/fileManage/delete/file', params);
}

export async function addInformationRelease(params) {
    return http.post('/bioec/w/deviceInformationPublish', params, 'body');
}

export async function deleteInformationRelease(params) {
    return http.delete('/bioec/w/deviceInformationPublish/{id}', params);
}

export async function publishInformationRelease(params) {
    return http.put('/bioec/w/deviceInformationPublish/{id}/publish', params);
}

export async function getVoiceBroadcastList(params) {
    return http.post('/bioec/w/deviceVoicebroadcast/s', params);
}

export async function getVoiceBroadcastDetail(params) {
    return http.get('/bioec/w/deviceVoicebroadcast/{id}', params);
}

export async function editVoiceBroadcast(params) {
    return http.put('/bioec/w/deviceVoicebroadcast/{id}', params, 'body');
}

export async function deleteVoiceBroadcast(params) {
    return http.delete('/bioec/w/deviceVoicebroadcast/{id}', params);
}

export async function publishVoiceBroadcast(params) {
    return http.put('/bioec/w/deviceVoicebroadcast/{id}/publish', params);
}

export async function addVoiceBroadcast(params) {
    return http.post('/bioec/w/deviceVoicebroadcast', params, 'body');
}

export async function getRepairRecordList(params) {
    return http.post('/bioec/w/deviceMaintenanceRecord/s', params);
}

export async function getRepairRecordDetail(params) {
    return http.get('/bioec/w/deviceMaintenanceRecord/{id}', params);
}

export async function addRepairRecord(params) {
    return http.post('/bioec/w/deviceMaintenanceRecord', params, 'body');
}

export async function updateRepairRecord(params) {
    return http.put('/bioec/w/deviceMaintenanceRecord/{id}', params, 'body');
}

export async function deleteRepairRecord(params) {
    return http.delete('/bioec/w/deviceMaintenanceRecord/{id}', params);
}

export async function getMaintenanceRecordList(params) {
    return http.post('/bioec/w/deviceUpkeepRecord/s', params);
}

export async function getMaintenanceRecordDetail(params) {
    return http.get('/bioec/w/deviceUpkeepRecord/{id}', params);
}

export async function addMaintenanceRecord(params) {
    return http.post('/bioec/w/deviceUpkeepRecord', params, 'body');
}

export async function updateMaintenanceRecord(params) {
    return http.put('/bioec/w/deviceUpkeepRecord/{id}', params, 'body');
}

export async function deleteMaintenanceRecord(params) {
    return http.delete('/bioec/w/deviceUpkeepRecord/{id}', params);
}

export async function getSeriesTree() {
    return http.post('/bioec/w/series/s');
}

export async function getEmployeeList() {
    return http.get('/bioec/w/employeeCustomers/maintenanceEmployee');
}

export async function getCustomerList() {
    return http.get('/bioec/w/customer/organization/currentAndSub');
}

export async function getDeviceControlRecordList(params) {
    params.sort = ['operationTime,desc'];
    return http.post('/bioec/w/deviceControlRecord/s', params);
}

export async function addControlRecord(params) {
    return http.post('/bioec/w/deviceControlRecord', params, 'body');
}

export async function getDeviceUpgradeRecordList(params) {
    return http.post('/bioec/w/deviceUpgradeRecord/s', params);
}

export async function getVersionInfo(params) {
    return http.get('/bioec/w/device/{id}/versionInfo', params);
}

export async function getDestVersionList(params) {
    return http.get('/bioec/w/device/{id}/destVersion/list', params);
}

export async function remoteUpgrade(params) {
    return http.post('/bioec/w/deviceUpgradeRecord', params, 'body');
}

export async function monitor(params) {
    return http.get('/bioec/w/device/{id}/mornitor', params);
}

