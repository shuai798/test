import { getTableList, getDetailRecord, dispose } from '../services/processedEvent';
import { message } from 'antd';

export default {
    namespace: 'processedEventSpace',

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
        industryTypeList: [],
    },

    effects: {
        // 分页
        *getTableList({ payload, callback }, { call, put }) {
            const response = yield call(getTableList, payload);
            yield put({
                type: 'saveTableList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 详情
        *getDetailList({ payload, callback }, { call }) {
            const response = yield call(getDetailRecord, payload);
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
    },
};
