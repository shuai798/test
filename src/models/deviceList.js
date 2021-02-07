import { message } from 'antd';
import { getDictionaryItemList } from '@/services/batchOperation';
import {
    getDeviceList,
    getDeviceDetail,
    unbind,
    getParameterSettings,
    editParameter,
    editManagementStatus,
    getExceptionRecordList,
    getExceptionRecordDetail,
    getBrokenRecordList,
    getBrokenRecordDetail,
    getInformationReleaseList,
    removeFile,
    removeFileByFileId,
    addInformationRelease,
    deleteInformationRelease,
    publishInformationRelease,
    getVoiceBroadcastList,
    getVoiceBroadcastDetail,
    editVoiceBroadcast,
    deleteVoiceBroadcast,
    publishVoiceBroadcast,
    addVoiceBroadcast,
    getRepairRecordList,
    getRepairRecordDetail,
    addRepairRecord,
    updateRepairRecord,
    deleteRepairRecord,
    getMaintenanceRecordList,
    getMaintenanceRecordDetail,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    getSeriesTree,
    getEmployeeList,
    getCustomerList,
    getDeviceControlRecordList,
    addControlRecord,
    getDeviceUpgradeRecordList,
    getVersionInfo,
    getDestVersionList,
    remoteUpgrade,
    monitor,
} from '../services/deviceList';

export default {
    namespace: 'deviceList',

    state: {
        deviceList: {
            data: [],
            pageable: {},
        },
        deviceDetail: {},
        parameterSettings: {},
        exceptionRecordList: {
            data: [],
            pageable: {},
        },
        exceptionRecordDetail: {},
        brokenRecordList: {
            data: [],
            pageable: {},
        },
        brokenRecordDetail: {},
        informationReleaseList: {
            data: [],
            pageable: {},
        },
        voiceBroadcastList: {
            data: [],
            pageable: {},
        },
        voiceBroadcastDetail: {},
        repairRecordList: {
            data: [],
            pageable: {},
        },
        repairRecordDetail: {},
        maintenanceRecordList: {
            data: [],
            pageable: {},
        },
        maintenanceRecordDetail: {},
        seriesTree: [],
        employeeList: [],
        customerList: [],
        deviceControlRecordList: {
            data: [],
            pageable: {},
        },
        deviceUpgradeRecordList: {
            data: [],
            pageable: {},
        },
        versionInfo: {},
        destVersionList: [],
        monitorDetail: {},
        sceneList: [],
        charactersList: [],
    },

    effects: {
        *getDeviceList({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getDeviceDetail({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceDetail',
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
        *getParameterSettings({ payload, callback }, { call, put }) {
            const response = yield call(getParameterSettings, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveParameterSettings',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *editParameter({ payload, callback }, { call }) {
            const response = yield call(editParameter, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('修改成功');
            if (callback) {
                callback();
            }
        },
        *editManagementStatus({ payload, callback }, { call }) {
            const response = yield call(editManagementStatus, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('修改成功');
            if (callback) {
                callback();
            }
        },
        *getExceptionRecordList({ payload, callback }, { call, put }) {
            const response = yield call(getExceptionRecordList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveExceptionRecordList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getExceptionRecordDetail({ payload, callback }, { call, put }) {
            const response = yield call(getExceptionRecordDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveExceptionRecordDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getBrokenRecordList({ payload, callback }, { call, put }) {
            const response = yield call(getBrokenRecordList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveBrokenRecordList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getBrokenRecordDetail({ payload, callback }, { call, put }) {
            const response = yield call(getBrokenRecordDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveBrokenRecordDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getInformationReleaseList({ payload, callback }, { call, put }) {
            const response = yield call(getInformationReleaseList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveInformationReleaseList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *removeFile({ payload, callback }, { call }) {
            const response = yield call(removeFile, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *removeFileByFileId({ payload, callback }, { call }) {
            const response = yield call(removeFileByFileId, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *addInformationRelease({ payload, callback }, { call }) {
            const response = yield call(addInformationRelease, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        *deleteInformationRelease({ payload, callback }, { call }) {
            const response = yield call(deleteInformationRelease, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *publishInformationRelease({ payload, callback }, { call }) {
            const response = yield call(publishInformationRelease, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('发布成功');
            if (callback) {
                callback();
            }
        },
        *getVoiceBroadcastList({ payload, callback }, { call, put }) {
            const response = yield call(getVoiceBroadcastList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveVoiceBroadcastList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getVoiceBroadcastDetail({ payload, callback }, { call, put }) {
            const response = yield call(getVoiceBroadcastDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveVoiceBroadcastDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *editVoiceBroadcast({ payload, callback }, { call }) {
            const response = yield call(editVoiceBroadcast, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        *deleteVoiceBroadcast({ payload, callback }, { call }) {
            const response = yield call(deleteVoiceBroadcast, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *publishVoiceBroadcast({ payload, callback }, { call }) {
            const response = yield call(publishVoiceBroadcast, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('发布成功');
            if (callback) {
                callback();
            }
        },
        *addVoiceBroadcast({ payload, callback }, { call }) {
            const response = yield call(addVoiceBroadcast, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        *getRepairRecordList({ payload, callback }, { call, put }) {
            const response = yield call(getRepairRecordList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveRepairRecordList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getRepairRecordDetail({ payload, callback }, { call, put }) {
            const response = yield call(getRepairRecordDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveRepairRecordDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *addRepairRecord({ payload, callback }, { call }) {
            const response = yield call(addRepairRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        *updateRepairRecord({ payload, callback }, { call }) {
            const response = yield call(updateRepairRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('修改成功');
            if (callback) {
                callback();
            }
        },
        *deleteRepairRecord({ payload, callback }, { call }) {
            const response = yield call(deleteRepairRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
            if (callback) {
                callback();
            }
        },
        *getMaintenanceRecordList({ payload, callback }, { call, put }) {
            const response = yield call(getMaintenanceRecordList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveMaintenanceRecordList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getMaintenanceRecordDetail({ payload, callback }, { call, put }) {
            const response = yield call(getMaintenanceRecordDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveMaintenanceRecordDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *addMaintenanceRecord({ payload, callback }, { call }) {
            const response = yield call(addMaintenanceRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('新增成功');
            if (callback) {
                callback();
            }
        },
        *updateMaintenanceRecord({ payload, callback }, { call }) {
            const response = yield call(updateMaintenanceRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('修改成功');
            if (callback) {
                callback();
            }
        },
        *deleteMaintenanceRecord({ payload, callback }, { call }) {
            const response = yield call(deleteMaintenanceRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('删除成功');
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
        *getEmployeeList({ payload, callback }, { call, put }) {
            const response = yield call(getEmployeeList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveEmployeeList',
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
                callback(response);
            }
        },
        *getDeviceControlRecordList({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceControlRecordList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceControlRecordList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *addControlRecord({ payload, callback }, { call }) {
            const response = yield call(addControlRecord, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback();
            }
        },
        *getDeviceUpgradeRecordList({ payload, callback }, { call, put }) {
            const response = yield call(getDeviceUpgradeRecordList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDeviceUpgradeRecordList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getVersionInfo({ payload, callback }, { call, put }) {
            const response = yield call(getVersionInfo, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveVersionInfo',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getDestVersionList({ payload, callback }, { call, put }) {
            const response = yield call(getDestVersionList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveDestVersionList',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *remoteUpgrade({ payload, callback }, { call }) {
            const response = yield call(remoteUpgrade, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('升级成功');
            if (callback) {
                callback();
            }
        },
        *monitor({ payload, callback }, { call, put }) {
            const response = yield call(monitor, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveMonitorDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *getSceneList({ payload, callback }, { call, put }) {
            const response = yield call(getDictionaryItemList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveSceneList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        *getCharactersList({ payload, callback }, { call, put }) {
            const response = yield call(getDictionaryItemList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'saveCharactersList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
    },

    reducers: {
        saveDeviceList(state, { payload }) {
            return {
                ...state,
                deviceList: payload || {},
            };
        },
        saveDeviceDetail(state, { payload }) {
            return {
                ...state,
                deviceDetail: payload.data || {},
            };
        },
        saveParameterSettings(state, { payload }) {
            return {
                ...state,
                parameterSettings: payload.data || {},
            };
        },
        saveExceptionRecordList(state, { payload }) {
            return {
                ...state,
                exceptionRecordList: payload || {},
            };
        },
        saveExceptionRecordDetail(state, { payload }) {
            return {
                ...state,
                exceptionRecordDetail: payload.data || {},
            };
        },
        saveBrokenRecordList(state, { payload }) {
            return {
                ...state,
                brokenRecordList: payload || {},
            };
        },
        saveBrokenRecordDetail(state, { payload }) {
            return {
                ...state,
                brokenRecordDetail: payload.data || {},
            };
        },
        saveInformationReleaseList(state, { payload }) {
            return {
                ...state,
                informationReleaseList: payload || {},
            };
        },
        saveVoiceBroadcastList(state, { payload }) {
            return {
                ...state,
                voiceBroadcastList: payload || {},
            };
        },
        saveVoiceBroadcastDetail(state, { payload }) {
            return {
                ...state,
                voiceBroadcastDetail: payload.data || {},
            };
        },
        saveRepairRecordList(state, { payload }) {
            return {
                ...state,
                repairRecordList: payload || {},
            };
        },
        saveRepairRecordDetail(state, { payload }) {
            return {
                ...state,
                repairRecordDetail: payload.data || {},
            };
        },
        saveMaintenanceRecordList(state, { payload }) {
            return {
                ...state,
                maintenanceRecordList: payload || {},
            };
        },
        saveMaintenanceRecordDetail(state, { payload }) {
            return {
                ...state,
                maintenanceRecordDetail: payload.data || {},
            };
        },
        saveSeriesTree(state, { payload }) {
            return {
                ...state,
                seriesTree: payload.data || {},
            };
        },
        saveEmployeeList(state, { payload }) {
            return {
                ...state,
                employeeList: payload.data || {},
            };
        },
        saveCustomerList(state, { payload }) {
            return {
                ...state,
                customerList: payload.data || {},
            };
        },
        saveDeviceControlRecordList(state, { payload }) {
            return {
                ...state,
                deviceControlRecordList: payload || {},
            };
        },
        saveDeviceUpgradeRecordList(state, { payload }) {
            return {
                ...state,
                deviceUpgradeRecordList: payload || {},
            };
        },
        saveVersionInfo(state, { payload }) {
            return {
                ...state,
                versionInfo: payload.data || {},
            };
        },
        saveDestVersionList(state, { payload }) {
            return {
                ...state,
                destVersionList: payload.data || {},
            };
        },
        saveMonitorDetail(state, { payload }) {
            return {
                ...state,
                monitorDetail: payload.data || {},
            };
        },
        saveSceneList(state, { payload }) {
            return {
                ...state,
                sceneList: payload.data,
            };
        },
        saveCharactersList(state, { payload }) {
            return {
                ...state,
                charactersList: payload.data,
            };
        },
    },
};
