import { message } from 'antd';
import { getTableList, getDeviceTop30 } from '../services/deviceTypeService';

export default {
    namespace: 'deviceTypeStatistics',

    state: {},

    effects: {
        *getTableListInfo({ payload, callback }, { call }) {
            const response = yield call(getTableList, payload);
            if (response.status !== 200) {
                message.error(response.message);
                return;
            }
            if (callback) {
                callback(response);
            }
        },
        *getDeviceTop30({ payload, callback }, { call }) {
            const response = yield call(getDeviceTop30, payload);
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
