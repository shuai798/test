import Api from './api';
import storage from './storage';

export default {
    exportAsset,
    exportOrg,
    exportContent,
    exportQrcode,
};

/*
  文件导出公共方法
  name：文件名，带后缀
  oldurl：后端接口，不含Api.httpHost
  method：请求方式，默认get
*/
function exportAsset(name, oldurl, method = 'get', body, callback) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open(method, `${Api.host.default}${encodeURI(oldurl)}`);
    xhr.setRequestHeader('authorization', storage.getStorage('authorization'));
    xhr.setRequestHeader('clientId', storage.getStorage('clientId'));
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
        if (e.target.status === 200) {
            const blob = e.target.response;
            // 这里的名字，可以按后端给的接口固定表单设置一下名字，如（费用单.xlsx,合同.doc等等）
            const filename = encodeURI(name);
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const a = document.createElement('a');
                const url = createObjectURL(blob);
                a.href = url;
                a.download = decodeURI(filename);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
            if (typeof callback === 'function') {
                callback();
            }
        }
    };
    if (method === 'get') {
        xhr.send(formData);
    }
    if (method === 'post') {
        xhr.send(body);
    }
    if (method === 'put') {
        xhr.send(formData);
    }
}

// 中粮批量下载二维码
function exportQrcode(name, oldurl, method = 'get', body, callback) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open(method, `${Api.exportHost}${encodeURI(oldurl)}`);
    xhr.setRequestHeader('authorization', storage.getStorage('authorization'));
    xhr.setRequestHeader('clientId', storage.getStorage('clientId'));
    xhr.setRequestHeader('Content-Type', 'application/zip;charset=utf-8');
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
        if (e.target.status === 200) {
            const blob = e.target.response;
            // 这里的名字，可以按后端给的接口固定表单设置一下名字，如（费用单.xlsx,合同.doc等等）
            const filename = encodeURI(name);
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const a = document.createElement('a');
                const url = createObjectURL(blob);
                a.href = url;
                a.download = decodeURI(filename);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
            if (typeof callback === 'function') {
                callback();
            }
        }
    };
    if (method === 'get') {
        xhr.send(formData);
    }
    if (method === 'post') {
        xhr.send(body);
    }
}

// 系统设置/标准管理/标准导出内容
function exportContent(name, oldurl, method = 'get', body) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open(method, `${Api.collectivization}${encodeURI(oldurl)}`);
    xhr.setRequestHeader('authorization', storage.getStorage('authorization'));
    xhr.setRequestHeader('clientId', storage.getStorage('clientId'));
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
        if (e.target.status === 200) {
            const blob = e.target.response;
            // 这里的名字，可以按后端给的接口固定表单设置一下名字，如（费用单.xlsx,合同.doc等等）
            const filename = encodeURI(name);
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const a = document.createElement('a');
                const url = createObjectURL(blob);
                a.href = url;
                a.download = decodeURI(filename);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }
    };
    if (method === 'get') {
        xhr.send(formData);
    }
    if (method === 'post') {
        xhr.send(body);
    }
}

function exportOrg(name, oldurl, method = 'get', body) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open(method, `/estate/uaa/w${oldurl}`);
    xhr.setRequestHeader('authorization', storage.getStorage('authorization'));
    xhr.setRequestHeader('clientId', storage.getStorage('clientId'));
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
        if (e.target.status === 200) {
            const blob = e.target.response;
            // 这里的名字，可以按后端给的接口固定表单设置一下名字，如（费用单.xlsx,合同.doc等等）
            const filename = name;
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const a = document.createElement('a');
                const url = createObjectURL(blob);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }
    };
    if (method === 'get') {
        xhr.send(formData);
    }
    if (method === 'post') {
        xhr.send(body);
    }
}

function createObjectURL(obj) {
    return window.URL ? window.URL.createObjectURL(obj) : window.webkitURL.createObjectURL(obj);
}
