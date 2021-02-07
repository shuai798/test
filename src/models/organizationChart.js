import { message } from 'antd';
import { getTableList, getDetailRecord, getTableListById, editDataDictionaryItem, addSettingItem, editSettingItem, deleteSettingItem, checkDataDictionaryName, up, down } from '../services/organizationChart';

export default {
    namespace: 'organizationChartSpace',

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
            const data = [];
            data.push(response.data);
            if (callback) {
                callback(data);
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
        *checkDataDictionaryName({ payload, callback }, { call }) {
            const response = yield call(checkDataDictionaryName, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response.data);
            }
        },
        *editDataDictionaryItem({ payload, callback }, { call }) {
            const response = yield call(editDataDictionaryItem, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        *addSettingItem({ payload, callback }, { call }) {
            const response = yield call(addSettingItem, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('添加成功');
            if (callback) {
                callback();
            }
        },
        *editSettingItem({ payload, callback }, { call }) {
            const response = yield call(editSettingItem, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        *deleteSettingItem({ payload, callback }, { call }) {
            const response = yield call(deleteSettingItem, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *up({ payload, callback }, { call }) {
            const response = yield call(up, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback();
            }
        },
        *down({ payload, callback }, { call }) {
            const response = yield call(down, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback();
            }
        },
        *getDetailRecord({ payload, callback }, { call }) {
            const response = yield call(getDetailRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
    },

    reducers: {
        saveSettingDataDictionaryList(state, action) {
            return {
                ...state,
                dataSettingDictionaryList: action.payload,
            };
        },
    },
};
