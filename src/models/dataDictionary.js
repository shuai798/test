import { message } from 'antd';
import { getTableList, getSettingDataDictionaryList, editDataDictionaryItem, addSettingItem, editSettingItem, deleteSettingItem, checkDataDictionaryName, changeSettingItemStatus, up, down, checkSettingName, getDictionaryItemList, checkEnumCode } from '../services/dataDictionary';

export default {
    namespace: 'dataDictionarySpace',

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
        *changeSettingItemStatus({ payload, callback }, { call }) {
            const response = yield call(changeSettingItemStatus, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
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
        *checkSettingName({ payload, callback }, { call }) {
            const response = yield call(checkSettingName, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response.data);
            }
        },
        *checkEnumCode({ payload, callback }, { call }) {
            const response = yield call(checkEnumCode, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response.data);
            }
        },
        *getDictionaryItemList({ payload, callback }, { call }) {
            const response = yield call(getDictionaryItemList, payload);
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
    },
};
