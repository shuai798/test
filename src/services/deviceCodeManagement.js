import http from '../utils/request';

export async function getDeviceCodeBatchList(params) {
    params.sort = ['createdDate,desc'];
    return http.post('/bioec/w/deviceNoBatch/s', params);
}

export async function getSeriesTree() {
    return http.post('/bioec/w/series/s');
}

export async function addDeviceCodeBatch(params) {
    return http.post('/bioec/w/deviceNoBatch', params, 'body');
}
