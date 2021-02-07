import { getTotalNumStatisticsData, getTableList, statisticsByType, statisticsBySeries, eventNumStatisticsTrendChartData, getTroubleTypeList, getTroubleModelList } from '../services/statisticsBreakdown';

export default {
    namespace: 'statisticsBreakdownSpace',

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
        troubleTypeInfo: {
            content: [],
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
        troubleModelInfo: {
            content: [],
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
        // 故障类型分页
        *getTroubleTypeList({ payload, callback }, { call, put }) {
            const response = yield call(getTroubleTypeList, payload);
            yield put({
                type: 'troubleTypeList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 故障型号分页
        *getTroubleModelList({ payload, callback }, { call, put }) {
            const response = yield call(getTroubleModelList, payload);
            yield put({
                type: 'troubleModelList',
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
        // 故障类型
        *statisticsByType({ payload, callback }, { call }) {
            const response = yield call(statisticsByType, payload);
            if (callback) {
                callback(response);
            }
        },
        // 故障型号
        *statisticsBySeries({ payload, callback }, { call }) {
            const response = yield call(statisticsBySeries, payload);
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
        troubleTypeList(state, { payload }) {
            return {
                ...state,
                troubleTypeInfo: payload.data || {},
            };
        },
        troubleModelList(state, { payload }) {
            return {
                ...state,
                troubleModelInfo: payload.data || {},
            };
        },
    },
};
