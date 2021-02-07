// 时间转化
export function dateFormat(format, date) {
    let fmt = format;
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    Object.keys(o).forEach(k => {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    });
    return fmt;
}

export function toQueryString(param, key, encode) {
    if (param instanceof FormData) {
        return param;
    }

    let paramStr = '';

    // 当值为null时转为空字串
    if (param == null) {
        paramStr += `&${key}=`;
    }

    const t = typeof param;
    if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += `&${key}=${encode == null || encode ? encodeURIComponent(param) : param}`;
    } else {
        Object.keys(param).forEach(i => {
            const k = key == null ? i : key + (param instanceof Array ? `[${param[i]}]` : `.${i}`);
            paramStr += toQueryString(param[i], k, encode);
        });
    }
    return paramStr;
}

// 当前时间 yyyy-MM-dd hh:mm:ss
export function curTime(date, format) {
    const dateCur = new Date();
    date.setHours(dateCur.getHours(), dateCur.getMinutes(), dateCur.getSeconds());
    return dateFormat(format, date);
}

// 今天凌晨时间 yyyy-MM-dd 00:00:00
export function todayWeeHoursTime(date, format) {
    date.setHours(0, 0, 0);
    return dateFormat(format, date);
}

// 今天凌晨时间 yyyy-MM-dd 23:59:059
export function weeHoursTime(date, format) {
    date.setHours(23, 59, 59);
    return dateFormat(format, date);
}

/**
 * js 原生cookie add
 *
 * @param {*} name
 * @param {*} value
 * @param {*} expiresSec
 */
export function jsAddCookie(name, value, expiresSec) {
    let cookieString = `${name}=${encodeURI(value)}`;
    // 判断是否设置过期时间
    if (expiresSec > 0) {
        const date = new Date();
        date.setTime(date.getTime() + expiresSec * 1000);
        cookieString = `${cookieString}; expires=${date.toGMTString()}`;
    }
    document.cookie = cookieString;
}
/**
 * js 原生cookie get
 *
 * @param {*} name
 */
export function jsGetCookie(name) {
    const strCookie = document.cookie;
    const arrCookie = strCookie.split('; ');
    for (let i = 0; i < arrCookie.length; i += 1) {
        const arr = arrCookie[i].split('=');
        if (arr[0] === name) { return arr[1]; }
    }
    return '';
}

/**
 * js 原生cookie delete
 *
 * @param {*} name
 */
export function jsDeleteCookie(name) {
    const date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = `${name}=v; expires=${date.toGMTString()}`;
}
/**
 * 获取当前url参数
 * @param {*} name
 */
export function getUrlKey(name) {
    return decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(window.location.href) || [''])[1].replace(/\+/g, '%20')) || null;
}
