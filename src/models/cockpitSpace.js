import { getWeatherData } from '../services/cockpitSpace';

export default {
    namespace: 'cockpitSpace',

    state: {},

    effects: {
        *getWeatherData({ payload, callback }, { call }) {
            const response = yield call(getWeatherData, payload);
            if (callback) {
                callback(response);
            }
        },
    },
};
