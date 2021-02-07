import { message } from 'antd';
import { getDeviceCodeBatchList, getSeriesTree, addDeviceCodeBatch } from '../services/deviceCodeManagement';

export default {
    namespace: 'deviceCodeManagement',

    state: {
        deviceCodeBatchList: {
            data: [],
            pageable: {},
        },
        seriesTree: [],
    },

    effects: {
        *getDeviceCodeBatchList({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceCodeBatchList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceCodeBatchList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getSeriesTree({ payload, callback }, { call, put }) {
            const response = yield call(getSeriesTree, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveSeriesTree',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        *addDeviceCodeBatch({ payload, callback }, { call }) {
            const response = yield call(addDeviceCodeBatch, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
    },

    reducers: {
        saveDeviceCodeBatchList(state, { payload }) {
            return {
                ...state,
                deviceCodeBatchList: payload || {},
            };
        },
        saveSeriesTree(state, { payload }) {
            return {
                ...state,
                seriesTree: payload.data || {},
            };
        },
    },
};
