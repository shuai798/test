import {
    message,
} from 'antd';
import {
    getTableList,
    getAllProjectList,
    addTable,
    editTableInfo,
    getDetailRecord,
    deleteTable,
} from '../services/channelManagement';

export default {
    namespace: 'channelManagement',

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
        allProjectList: [],
    },

    effects: {
        // 分页
        * getTableListInfo({
            payload,
            callback,
        }, {
            call,
            put,
        }) {
            const response = yield call(getTableList, payload);
            yield put({
                type: 'saveTableList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        // 获取所有项目
        * getAllProjectList({
            payload,
            callback,
        }, {
            call,
            put,
        }) {
            const response = yield call(getAllProjectList, payload);
            yield put({
                type: 'saveAllProjectList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        // 新增
        * addTableInfo({
            payload,
            callback,
        }, {
            call,
        }) {
            yield call(addTable, payload);
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        // 编辑
        * editTableInfo({
            payload,
            callback,
        }, {
            call,
        }) {
            yield call(editTableInfo, payload);
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        // 详情
        * getDetailRecord({
            payload,
            callback,
        }, {
            call,
        }) {
            const response = yield call(getDetailRecord, payload);
            if (callback) {
                callback(response);
            }
        },
        // 删除
        * deleteTableInfo({
            payload,
            callback,
        }, {
            call,
        }) {
            yield call(deleteTable, payload);
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
    },

    reducers: {
        saveTableList(state, {
            payload,
        }) {
            return {
                ...state,
                tableInfo: payload || {},
            };
        },
        saveAllProjectList(state, {
            payload,
        }) {
            return {
                ...state,
                allProjectList: payload || [],
            };
        },
        saveIndustryTypeList(state, {
            payload,
        }) {
            return {
                ...state,
                industryTypeList: payload.data || [],
            };
        },
    },
};