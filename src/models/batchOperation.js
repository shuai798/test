import { message } from 'antd';
import { getTableList, getBatchOperationList, addBatchOperation, getDetaiTablelList, getDetaiList, issuedAgain, batchIssuedAgain, getDestVersion, getDictionaryItemList } from '../services/batchOperation';

export default {
    namespace: 'batchOperationSpace',

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
        batchOperationInfo: {
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
        detailListInfo: {
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
        sceneList: [],
        charactersList: [],
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
        // 批量操作分页
        *getBatchOperationList({ payload, callback }, { call, put }) {
            const response = yield call(getBatchOperationList, payload);
            yield put({
                type: 'batchOperationList',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 详情分页
        *getDetaiTablelList({ payload, callback }, { call, put }) {
            const response = yield call(getDetaiTablelList, payload);
            yield put({
                type: 'detailListInfo',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
        // 详情数据
        *getDetaiList({ payload, callback }, { call }) {
            const response = yield call(getDetaiList, payload);
            if (callback) {
                callback(response);
            }
        },
        // 新建批量操作
        *addBatchOperation({ payload, callback }, { call }) {
            const response = yield call(addBatchOperation, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        // 再次下发
        *issuedAgain({ payload, callback }, { call }) {
            const response = yield call(issuedAgain, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        // 批量再次下发
        *batchIssuedAgain({ payload, callback }, { call }) {
            const response = yield call(batchIssuedAgain, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        // 批量再次下发
        *getDestVersion({ payload, callback }, { call }) {
            const response = yield call(getDestVersion, payload);
            if (callback) {
                callback(response);
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
        saveTableList(state, { payload }) {
            return {
                ...state,
                tableInfo: payload || {},
            };
        },
        batchOperationList(state, { payload }) {
            return {
                ...state,
                batchOperationInfo: payload || {},
            };
        },
        detailListInfo(state, { payload }) {
            return {
                ...state,
                detailListInfo: payload || {},
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
