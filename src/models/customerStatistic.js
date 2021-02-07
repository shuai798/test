import { getCountInfo, getIndustryDistributionOverview, getTableList, getIndustryListInfo, getIndustryDistributionWhole, getProjectCountAndAccessDeviceCountByProvince, getStaffSizeDistributionList } from '../services/customerStatistic';

export default {
    namespace: 'customerStatisticSpace',

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
        industryInfo: {
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
        //行业统计
        *getIndustryListInfo({ payload, callback }, { call, put }) {
            const response = yield call(getIndustryListInfo, payload);
            yield put({
                type: 'saveIndustryList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 获取客户数量、项目数量、销售设备数
        *getCountInfo({ payload, callback }, { call }) {
            const response = yield call(getCountInfo, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取行业分布占比前五
        *getIndustryDistributionOverview({ payload, callback }, { call }) {
            const response = yield call(getIndustryDistributionOverview, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取行业分布前三十
        *getIndustryDistributionWhole({ payload, callback }, { call }) {
            const response = yield call(getIndustryDistributionWhole, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取项目数量分布
        *getProjectCountAndAccessDeviceCountByProvince({ payload, callback }, { call }) {
            const response = yield call(getProjectCountAndAccessDeviceCountByProvince, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取项目数量分布
        *getStaffSizeDistributionList({ payload, callback }, { call }) {
            const response = yield call(getStaffSizeDistributionList, payload);
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
        saveIndustryList(state, { payload }) {
            return {
                ...state,
                industryInfo: payload || {},
            };
        },
    },
};
