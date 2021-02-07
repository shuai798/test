/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
import { extend } from 'umi-request';
import { message } from 'antd';
import router from 'umi/router';
import Api from '@/utils/api';
import storage from '@/utils/storage';
// const codeMessage = {
//     401: '用户没有权限（令牌、用户名、密码错误），请重新登录。',
//     // 404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//     502: '网关错误，请重新登录。',
//     503: '服务不可用，服务器暂时过载或维护。',
//     504: '网关超时，请重新登录。',
// };
/**
 * 异常处理程序
 */
const errorHandler = (error) => {
    const { response, data } = error;
    if (response && response.status) {
        // const errorText = codeMessage[response.status] || response.statusText;
        const { status } = response;
        const errorStatus = [401, 502, 503, 504];
        if (errorStatus.includes(status)) {
            message.error('网络异常，请刷新重试！');
            router.push('/login');
        } else if (data && data.error && data.error === 'invalid_grant') {
            message.error(data.error_description);
        } else {
            message.error(data.message || '网络异常，请刷新重试！');
        }
    } else {
        message.error('网络异常，请刷新重试！');
    }
    // throw Error('请求错误！');
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
    timeout: 20000,
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
    // 替换特殊字符，防止后端接口报错
    url = url.replace(/\^|\\|\||\[|\]|`|{|}/g, '');
    let headers = options.headers || {};
    let Authorization = storage.getStorage('authorization');
    Authorization = Authorization === 'undefined' || !Authorization ? '' : Authorization;
    let clientId = storage.getStorage('clientId');
    clientId = clientId === 'undefined' || !clientId ? '' : clientId;
    headers = {
        ...headers,
        Authorization,
        clientId,
    };
    const reOptions = {
        ...options,
        headers,
    };

    return {
        url,
        options: reOptions,
    };
});

const http = {
    /**
     * @Description: http请求方法
     * @param: type: query - url拼接参数、body - body体、form-data - Form Data
     */
    get: async (url, params, type = 'query', host = Api.host.default) => {
        url = url.replace(/{([\w]+)}/g, (val) => {
            const deleteKey = val.replace(/{|}/g, '');
            const paramURL = params[val.replace(/{|}/g, '')];
            delete params[deleteKey];
            return paramURL;
        });
        if (type === 'body') {
            return await request(host + url, {
                method: 'GET',
                data: params,
            });
        }
        if (type === 'query') {
            return await request(host + url, {
                method: 'GET',
                params,
            });
        }
        if (type === 'form-data') {
            return await request(host + url, {
                requestType: 'form',
                method: 'GET',
                data: params,
            });
        }
    },
    post: async (url, params, type = 'query', host = Api.host.default) => {
        url = url.replace(/{([\w]+)}/g, (val) => {
            const deleteKey = val.replace(/{|}/g, '');
            const paramURL = params[val.replace(/{|}/g, '')];
            delete params[deleteKey];
            return paramURL;
        });
        if (type === 'body') {
            return await request(host + url, {
                method: 'POST',
                data: params,
            });
        }
        if (type === 'query') {
            return await request(host + url, {
                method: 'POST',
                params,
            });
        }
        if (type === 'form-data') {
            return await request(host + url, {
                requestType: 'form',
                method: 'POST',
                data: params,
            });
        }
    },
    getWeatherData: async (url) => {
        return await request(url, {
            method: 'GET',
        });
    },
    put: async (url, params, type = 'query', host = Api.host.default) => {
        url = url.replace(/{([\w]+)}/g, (val) => {
            const deleteKey = val.replace(/{|}/g, '');
            const paramURL = params[val.replace(/{|}/g, '')];
            delete params[deleteKey];
            return paramURL;
        });
        if (type === 'body') {
            return await request(host + url, {
                method: 'PUT',
                data: params,
            });
        }
        if (type === 'query') {
            return await request(host + url, {
                method: 'PUT',
                params,
            });
        }
        if (type === 'form-data') {
            return await request(host + url, {
                requestType: 'form',
                method: 'PUT',
                data: params,
            });
        }
    },
    delete: async (url, params, type = 'query', host = Api.host.default) => {
        url = url.replace(/{([\w]+)}/g, (val) => {
            const deleteKey = val.replace(/{|}/g, '');
            const paramURL = params[val.replace(/{|}/g, '')];
            delete params[deleteKey];
            return paramURL;
        });
        if (type === 'body') {
            return await request(host + url, {
                method: 'DELETE',
                data: params,
            });
        }
        if (type === 'query') {
            return await request(host + url, {
                method: 'DELETE',
                params,
            });
        }
        if (type === 'form-data') {
            return await request(host + url, {
                requestType: 'form',
                method: 'DELETE',
                data: params,
            });
        }
    },
};

export default http;
