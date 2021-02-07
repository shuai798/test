import { message } from 'antd';
import { getTableList, getTableListByCondition, getTableListById, addTenantEmployee, editTenantEmployee, getDetailRecord, resetPassword, updatePhone, getCurrentCustomer, getAppList, getWebList, deleteTenantEmployee } from '../services/accountKeeper';

export default {
    namespace: 'accountKeeperSpace',

    state: {
        tableInfo: {
            data: [],
        },
        systemDataList: [],
        dataSettingDictionaryList: {
            // 配置中的分页数据
            data: [],
            pageable: {},
        },
    },

    effects: {
        *getTableListInfo({ payload, callback }, { call }) {
            const response = yield call(getTableList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *getTableListByCondition({ payload, callback }, { call }) {
            const response = yield call(getTableListByCondition, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *getTableListById({ payload, callback }, { call }) {
            const response = yield call(getTableListById, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *addTenantEmployee({ payload, callback }, { call }) {
            const response = yield call(addTenantEmployee, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback(response);
            }
        },
        *editTenantEmployee({ payload, callback }, { call }) {
            const response = yield call(editTenantEmployee, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('编辑成功');
            if (callback) {
                callback(response);
            }
        },
        *detailRecord({ payload, callback }, { call }) {
            const response = yield call(getDetailRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *resetPassword({ payload, callback }, { call }) {
            const response = yield call(resetPassword, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('重置密码成功！');
            if (callback) {
                callback(response);
            }
        },
        *updatePhone({ payload, callback }, { call }) {
            const response = yield call(updatePhone, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('修改成功');
            if (callback) {
                callback();
            }
        },
        *getCurrentCustomer({ payload, callback }, { call }) {
            const response = yield call(getCurrentCustomer, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *getAppList({ payload, callback }, { call }) {
            const response = yield call(getAppList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *getWebList({ payload, callback }, { call }) {
            const response = yield call(getWebList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *deleteTenantEmployee({ payload, callback }, { call }) {
            const response = yield call(deleteTenantEmployee, payload);
            if (response.status !== 200) {
                message.error(response.message);
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
    },

    reducers: {},
};
