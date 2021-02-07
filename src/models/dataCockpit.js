import { getCustomerIndustryTop5, getEventList, getDeviceRest } from '../services/dataCockpit';

export default {
    namespace: 'dataCockpitSpace',

    state: {},

    effects: {
        *getCustomerIndustryTop5({ payload, callback }, { call }) {
            const response = yield call(getCustomerIndustryTop5, payload);
            if (callback) {
                callback(response);
            }
        },
        *getEventList({ payload, callback }, { call }) {
            const response = yield call(getEventList, payload);
            if (callback) {
                callback(response);
            }
        },
        *getDeviceRest({ payload, callback }, { call }) {
            const response = yield call(getDeviceRest, payload);
            if (callback) {
                callback(response);
            }
        },
    },

    reducers: {},
};
