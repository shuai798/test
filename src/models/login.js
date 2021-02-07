/*
 * @Author: wangdi
 * @Date: 2020-03-09 10:59:06
 * @Last Modified by: wangdi
 * @Last Modified time: 2020-04-08 10:03:55
 */
import router from 'umi/router';
import { loginOauth, authMe, authClients, menuList, downloadUrl } from '@/services/loginService';
import storage from '@/utils/storage';
import { message } from 'antd';

export default {
    namespace: 'login',
    state: {},
    effects: {
        // 先登录获取token
        *loginSystem({ payload, callback }, { call }) {
            const response = yield call(loginOauth, payload);
            if (response.access_token !== undefined) {
                // token前面需要加上 Bearer （有空格）
                storage.saveStorage('authorization', `Bearer ${response.access_token}`);
            } else {
                return;
            }
            if (callback) {
                callback(response.access_token);
            }
        },
        // 登录后再获取管理系统列表
        *authClients({ payload, callback }, { call }) {
            const response = yield call(authClients, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (response.status === 200) {
                storage.saveStorage('systemList', response.data);
            } else {
                storage.clearStorage();
                return;
            }
            if (callback) {
                callback(response.data);
            }
        },
        // 选择管理系统后 登录
        *authMe({ payload, callback }, { call }) {
            const response = yield call(authMe, payload);
            if (response.status === 200) {
                storage.saveStorage('loginInfo', response.data.userPrincipal);
                storage.saveStorage('userInfo', response.data.userPrincipal);
                storage.saveStorage('menuTree', response.data.authorities);
                storage.saveStorage('authMeData', response.data);
            } else {
                storage.clearStorage();
                return;
            }
            if (callback) {
                callback(response.data);
            }
        },
        // 获取菜单
        *menuList({ payload, callback }, { call, put }) {
            const response = yield call(menuList, payload);
            localStorage.setItem('menuTree', JSON.stringify(response.data));
            yield put({
                type: 'saveMenuList',
                payload: response.data || [],
            });
            if (callback) {
                callback(response.data);
            }
        },
        // 退出登录
        *logout() {
            if (window.location.pathname !== '/login') {
                yield router.replace('/login');
            }
        },
        *downloadUrl({ payload, callback }, { call }) {
            const response = yield call(downloadUrl, payload);
            if (callback) {
                callback(response.data);
            }
        },
    },
    reducers: {
        saveMenuList(state, { payload }) {
            return {
                ...state,
                menuList: payload || [],
            };
        },
    },
};
