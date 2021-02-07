import { message } from 'antd';
import { getDeviceAssignmentList, getDeviceAssignmentDetail, batchAddDeviceAssignment, updateDeviceAssignment, batchUpdateDeviceAssignment, batchDeleteTableInfo, checkImportFile, importAssignment, getSeriesTree, getCustomerList, getDeviceNoListBySeriesId } from '../services/deviceAssignment';
import { unbind } from '@/services/deviceList';

export default {
    namespace: 'deviceAssignment',

    state: {
        deviceAssignmentList: {
            data: [],
            pageable: {},
        },
        deviceAssignmentDetail: {},
        seriesTree: [],
        customerList: [],
        importDetail: {},
        deviceNoList: [],
    },

    effects: {
        *getDeviceAssignmentList({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceAssignmentList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceAssignmentList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getDeviceAssignmentDetail({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceAssignmentDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceAssignmentDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *batchAddDeviceAssignment({ payload, callback }, { call }) {
            const response = yield call(batchAddDeviceAssignment, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        *updateDeviceAssignment({ payload, callback }, { call }) {
            const response = yield call(updateDeviceAssignment, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        *batchUpdateDeviceAssignment({ payload, callback }, { call }) {
            const response = yield call(batchUpdateDeviceAssignment, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('批量分配成功');
            if (callback) {
                callback();
            }
        },
        *batchDeleteTableInfo({ payload, callback }, { call }) {
            const response = yield call(batchDeleteTableInfo, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *checkImportFile({ payload, callback }, { call, put }) {
            const response = yield call(checkImportFile, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveImportDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *importAssignment({ payload, callback }, { call, put }) {
            const response = yield call(importAssignment, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveImportDetail',
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
                callback();
            }
        },
        *getCustomerList({ payload, callback }, { call, put }) {
            const response = yield call(getCustomerList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveCustomerList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getDeviceNoListBySeriesId({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceNoListBySeriesId, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceNoList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *unbind({ payload, callback }, { call }) {
            const response = yield call(unbind, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('解绑成功');
            if (callback) {
                callback();
            }
        },
    },

    reducers: {
        saveDeviceAssignmentList(state, { payload }) {
            return {
                ...state,
                deviceAssignmentList: payload || {},
            };
        },
        saveDeviceAssignmentDetail(state, { payload }) {
            return {
                ...state,
                deviceAssignmentDetail: payload.data || {},
            };
        },
        saveImportDetail(state, { payload }) {
            return {
                ...state,
                importDetail: payload.data || {},
            };
        },
        saveSeriesTree(state, { payload }) {
            return {
                ...state,
                seriesTree: payload.data || {},
            };
        },
        saveCustomerList(state, { payload }) {
            return {
                ...state,
                customerList: payload.data || {},
            };
        },
        saveDeviceNoList(state, { payload }) {
            return {
                ...state,
                deviceNoList: payload.data || {},
            };
        },
    },
};
