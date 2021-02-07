import { message } from 'antd';
import { getTableList, getOrganizationInfo, getIndustryTypeList, getAreaInfo, addTable, editTableInfo, getDetailRecord, deleteTable } from '../services/customerManagement';

export default {
    namespace: 'customerManagement',

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
        // 获取组织
        *getOrganizationInfo({ payload, callback }, { call }) {
            const response = yield call(getOrganizationInfo, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取行业类型
        *getIndustryTypeList({ payload, callback }, { call, put }) {
            const response = yield call(getIndustryTypeList, payload);
            yield put({
                type: 'saveIndustryTypeList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 获取区域
        *getAreaInfo({ payload, callback }, { call }) {
            const response = yield call(getAreaInfo, payload);
            if (callback) {
                callback(response);
            }
        },
        // 新增
        *addTableInfo({ payload, callback }, { call }) {
            const response = yield call(addTable, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        // 编辑
        *editTableInfo({ payload, callback }, { call }) {
            yield call(editTableInfo, payload);
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        // 详情
        *getDetailRecord({ payload, callback }, { call }) {
            const response = yield call(getDetailRecord, payload);
            if (callback) {
                callback(response);
            }
        },
        // 删除
        *deleteTableInfo({ payload, callback }, { call }) {
            yield call(deleteTable, payload);
            message.success('删除成功');
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
        saveIndustryTypeList(state, { payload }) {
            return {
                ...state,
                industryTypeList: payload.data || [],
            };
        },
    },
};
