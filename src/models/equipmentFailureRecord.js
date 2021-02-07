import { message } from 'antd';
import { getTableList, getDetailList } from '../services/equipmentFailureService';

export default {
    namespace: 'equipmentFailureRecord',

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
        *getDetailList({ payload, callback }, { call }) {
            const response = yield call(getDetailList, payload);
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
