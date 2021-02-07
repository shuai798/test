/*
  对象型参数转param型参数
  可以根据后端是否对null有特殊处理逻辑进行修改
  ps:此处可以将null作为值传入后端
*/
function bodyToParm(objBody, head, oldParam) {
    const body = objBody;
    let param = '';
    let newHead = '';
    if (head) {
        newHead = head;
    }
    if (oldParam) {
        param = oldParam;
    }
    if (undefined !== body) {
        let flag = 0;
        if (param) {
            flag = 1;
        }
        Object.keys(body).forEach((i) => {
            if (undefined !== body[i]) {
                if (typeof body[i] === 'string') {
                    body[i] = body[i].trim();
                }
                if (flag === 0) {
                    if (body[i] instanceof Object) {
                        param = bodyToParm(body[i], `${newHead}${i}.`, param);
                    } else {
                        param = `?${newHead}${i}=${encodeURIComponent(body[i])}`;
                    }
                    if (param) {
                        flag = 1;
                    }
                } else if (body[i] instanceof Object) {
                    param = bodyToParm(body[i], `${newHead}${i}.`, param);
                } else {
                    param = `${param}&${newHead}${i}=${encodeURIComponent(body[i])}`;
                }
            }
        });
    }
    return param;
}

export function toQueryString(param, key, encode) {
    if (param instanceof FormData) {
        return param;
    }

    let paramStr = '';

    //当值为null时转为空字串
    if (param === null) {
        paramStr += `&${key}=` + '';
    }

    const t = typeof param;
    if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += `&${key}=${encode == null || encode ? encodeURIComponent(param) : param}`;
    } else {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in param) {
            const k = key == null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`);
            paramStr += toQueryString(param[i], k, encode);
        }
    }
    return paramStr;
}

// Form表单提交时去除首尾空格
function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

const host = {
    default: '/bart',
    xahc: 'http://www.baidu.com',
};

export default {
    bodyToParm,
    trimStr,
    host,
};