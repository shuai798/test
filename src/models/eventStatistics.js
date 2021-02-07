import { getTotalNumStatisticsData, getTableList, statisticsByType, eventNumStatisticsTrendChartData } from '../services/eventStatistics';

export default {
    namespace: 'eventStatisticsSpace',

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
        *getTotalNumStatisticsData({ payload, callback }, { call }) {
            const response = yield call(getTotalNumStatisticsData, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取待处理已处理事件
        *statisticsByType({ payload, callback }, { call }) {
            const response = yield call(statisticsByType, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取设备接入趋势
        *eventNumStatisticsTrendChartData({ payload, callback }, { call }) {
            const response = yield call(eventNumStatisticsTrendChartData, payload);
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
