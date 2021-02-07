import { getTableList, getTypes } from '../services/operationLog';

export default {
    namespace: 'operationLogSpace',

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
        *getTypes({ payload, callback }, { call, put }) {
            const response = yield call(getTypes, payload);
            if (callback) {
                callback(response);
            }
        }
    },

    reducers: {
        saveTableList(state, { payload }) {
            return {
                ...state,
                tableInfo: payload || {},
            };
        },
    },
};
