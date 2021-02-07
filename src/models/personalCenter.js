import { message } from 'antd';
import { getPersonalInformationDetail, updateName, resetPassword, updatePhone, updatePhoto } from '../services/personalCenter';

export default {
    namespace: 'personalCenter',

    state: {
        personalInformationDetail: {},
    },

    effects: {
        *getPersonalInformationDetail({ payload, callback }, { call, put }) {
            const response = yield call(getPersonalInformationDetail, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            yield put({
                type: 'savePersonalInformationDetail',
                payload: response,
            });
            if (callback) {
                callback();
            }
        },
        *updateName({ payload, callback }, { call }) {
            const response = yield call(updateName, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('编辑成功');
            if (callback) {
                callback();
            }
        },
        *resetPassword({ payload, callback }, { call }) {
            const response = yield call(resetPassword, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('密码重置成功');
            if (callback) {
                callback();
            }
        },
        *updatePhone({ payload, callback }, { call }) {
            const response = yield call(updatePhone, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            message.success('变更成功');
            if (callback) {
                callback();
            }
        },
        *updatePhoto({ payload, callback }, { call }) {
            const response = yield call(updatePhoto, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback();
            }
        },
    },

    reducers: {
        savePersonalInformationDetail(state, { payload }) {
            return {
                ...state,
                personalInformationDetail: payload.data || {},
            };
        },
    },
};
