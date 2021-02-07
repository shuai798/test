import { message } from 'antd';
import { checkMobile, sendCode, checkCode, changePassword } from '../services/forgetPassword';

export default {
    namespace: 'forgetPassword',

    state: {},

    effects: {
        // 检查手机号是否存在
        * checkMobile({ payload, callback }, { call }) {
            const response = yield call(checkMobile, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        // 发送验证码
        * sendCode({ payload, callback }, { call }) {
            const response = yield call(sendCode, payload);
            if (response.status !== 200) {
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        // 检查验证码
        * checkCode({ payload, callback }, { call }) {
            const response = yield call(checkCode, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        // 修改密码
        * changePassword({ payload, callback }, { call }) {
            const response = yield call(changePassword, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }

            if (callback) {
                callback(response);
            }
        },
    },

    reducers: {},
};