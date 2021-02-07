import http from '../utils/request';

export async function getTableList(params) {
    return http.post('/bioec/w/jobExecuteLog/s', params);
}
