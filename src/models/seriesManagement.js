import { message } from 'antd';
import { getTableList, addTable, editTableInfo, getDetailRecord, deleteTable, up, down } from '../services/seriesManagement';

export default {
    namespace: 'seriesManagement',

    state: {
        tableInfo: {
            data: [],
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
                callback();
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
        // 上移
        *up({ payload, callback }, { call }) {
            const response = yield call(up, payload);
            if (response.status !== 200) {
                message.warn(response.message);
                return;
            }
            if (callback) {
                callback();
            }
        },
        // 下移
        *down({ payload, callback }, { call }) {
            const response = yield call(down, payload);
            if (response.status !== 200) {
                message.warn(response.message);
                return;
            }
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
