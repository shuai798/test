import { message } from 'antd';
import { getTableList, getSettingDataDictionaryList, editDataDictionaryItem, addSettingItem, editSettingItem, deleteSettingItem, checkDataDictionaryName, getDetailRecord } from '../services/roleMangement';

export default {
    namespace: 'roleMangementSpace',

    state: {
        tableInfo: {
            data: [],
            pageable: {
                totalElements: 0,
                numberOfElements: 10,
                totalPages: 1,
                number: 0,
                first: true,
                last: true,
                size: 10,
                toNumber: 10,
                fromNumber: 1,
            },
        },
        systemDataList: [],

        dataSettingDictionaryList: {
            // 配置中的分页数据
            data: [],
            pageable: {},
        },

        detailList: [],
    },

    effects: {
        *getTableListInfo({ payload, callback }, { call, put }) {
            const response = yield call(getTableList, payload);
            yield put({
                type: 'saveTableList',
                payload: response,
            });
            if (callback) {
                callback();
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
        *getSettingDataDictionaryList({ payload, callback }, { call, put }) {
            const response = yield call(getSettingDataDictionaryList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveSettingDataDictionaryList',
                payload: response,
            });
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
            message.success('新增成功');
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
        *getDetailRecord({ payload, callback }, { call, put }) {
            const response = yield call(getDetailRecord, payload);
            yield put({
                type: 'saveDetailList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
    },

    reducers: {
        saveTableList(state, { payload }) {
            return {
                ...state,
                tableInfo: payload || {},
            };
        },
        saveSettingDataDictionaryList(state, action) {
            return {
                ...state,
                dataSettingDictionaryList: action.payload,
            };
        },
        saveDetailList(state, { payload }) {
            return {
                ...state,
                detailList: payload.data || {},
            };
        },
    },
};
