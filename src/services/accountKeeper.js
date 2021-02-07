import http from '../utils/request';

/* 获取数据字典分页数据 */
export async function getTableList(params) {
    return http.post('/uaa/w/organization', params);
}

export async function getTableListByCondition(params) {
    return http.post('/uaa/w/organizationEmployee/s', params);
}

export async function getTableListById(params) {
    return http.post('/uaa/w/organization', params);
}

export async function addTenantEmployee(params) {
    return http.post('/bioec/w/employeeCustomers', params, 'body');
}

export async function editTenantEmployee(params) {
    return http.put('/bioec/w/employeeCustomers/{id}', params, 'body');
}

export async function getDetailRecord(params) {
    return http.get('/bioec/w/employeeCustomers/{id}', params);
}

export async function resetPassword(params) {
    return http.post('/uaa/w/user/password/set/{mobile}', params);
}

export async function updatePhone(params) {
    return http.post('/uaa/w/user/mobile/update/{mobile}/{newMobile}', params);
}

export async function getCurrentCustomer(params) {
    return http.get('/bioec/w/customer/organization/currentAndSub', params);
}

export async function getAppList(params) {
    return http.get('/uaa/w/role/list/app', params);
}

export async function getWebList(params) {
    return http.get('/uaa/w/role/list/web', params);
}

export async function deleteTenantEmployee(params) {
    return http.delete('/bioec/w/employeeCustomers/{id}', params);
}
