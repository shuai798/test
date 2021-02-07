import { deviceStatisticsTotalData, getTableList, customerIndustryTop5, deviceStatusData, accessTrendChartData } from '../services/deviceAccessStatistic';

export default {
    namespace: 'deviceAccessStatisticSpace',

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
    },

    effects: {
        // 分页
        *getTableListInfo({ payload, callback }, { call, put }) {
            const response = yield call(getTableList, payload);
            yield put({
                type: 'saveTableList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 获取总体统计数据
        *deviceStatisticsTotalData({ payload, callback }, { call }) {
            const response = yield call(deviceStatisticsTotalData, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取设备类型
        *customerIndustryTop5({ payload, callback }, { call }) {
            const response = yield call(customerIndustryTop5, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取设备状态
        *deviceStatusData({ payload, callback }, { call }) {
            const response = yield call(deviceStatusData, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取设备接入趋势
        *accessTrendChartData({ payload, callback }, { call }) {
            const response = yield call(accessTrendChartData, payload);
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
