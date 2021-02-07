import http from '../utils/request';

/* 获取分页数据 */
export async function getWeatherData() {
    return http.getWeatherData('/weather/v001/now?areacode=101040100&key=q42fkPRlK3AjNuDGpFEffV76L1KSCOKV&output_type=json');
}
