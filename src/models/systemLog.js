import { getTableList } from '../services/systemLog';

export default {
    namespace: 'systemLogSpace',

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
