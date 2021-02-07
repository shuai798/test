import defaultSettings from '../../config/defaultSettings';
import themeColorClient from '../utils/themeColorClient';

const initSetting = defaultSet => {
    const newDefaultSetting = defaultSet;
    if (localStorage.getItem('navTheme')) {
        newDefaultSetting.navTheme = localStorage.getItem('navTheme');
    }
    if (localStorage.getItem('primaryColor')) {
        newDefaultSetting.primaryColor = '#4DB22F';
        themeColorClient.changeColor(newDefaultSetting.primaryColor);
    }
    const urlParams = new URL(window.location.href);
    Object.keys(newDefaultSetting).forEach(key => {
        if (urlParams.searchParams.has(key)) {
            urlParams.searchParams.delete(key);
        }
    });
    return newDefaultSetting;
};

export default {
    namespace: 'settings',
    state: initSetting(defaultSettings),
    reducers: {
        changeSetting(state, { payload }) {
            const { navTheme, primaryColor } = payload;
            if (navTheme && navTheme !== state.navTheme) {
                // 处理主题逻辑待处理
            }
            // 全局默认色设置
            if (primaryColor && primaryColor !== state.primaryColor) {
                themeColorClient.changeColor(primaryColor);
            }
            const urlParams = new URL(window.location.href);
            Object.keys(state).forEach(key => {
                if (urlParams.searchParams.has(key)) {
                    urlParams.searchParams.delete(key);
                }
            });
            return { ...state, ...payload };
        },
    },
};
