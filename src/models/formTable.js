import { message } from 'antd';
import {
    getTableList,
    deleteTable,
    addTable,
    updateTable,
    getSystemData,
} from '../services/formTable';

export default {
    namespace: 'formTableSpace',

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
    },

    effects: {
        *getTableListInfo({ payload, callback }, { call, put }) {
            const response = yield call(getTableList, payload);
            yield put({
                type: 'saveTableList',
                payload: response,
            });
            if (callback) { callback(); }
        },
        *getSystemDataInfo({ payload, callback }, { call, put }) {
            const response = yield call(getSystemData, payload);
            yield put({
                type: 'saveSystemData',
                payload: response,
            });
            if (callback) { callback(); }
        },
        *addTableInfo({ payload, callback }, { call }) {
            yield call(addTable, payload);
            message.success('新建成功');
            if (callback) { callback(); }
        },
        *updateTableInfo({ payload, callback }, { call }) {
            yield call(updateTable, payload);
            message.success('编辑成功');
            if (callback) { callback(); }
        },
        *deleteTableInfo({ payload, callback }, { call }) {
            yield call(deleteTable, payload);
            message.success('删除成功');
            if (callback) { callback(); }
        },
    },

    reducers: {
        saveTableList(state, { payload }) {
            return {
                ...state,
                tableInfo: payload || {},
            };
        },
        saveSystemData(state, { payload }) {
            return {
                ...state,
                systemDataList: payload.data || [],
            };
        },
    },
};
