import http from '../utils/request';
import Api from '../utils/api';

export async function getTableList(params) {
    return http.post('/iotplatform/w/deviceGroup/s', params);
}
