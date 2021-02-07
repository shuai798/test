export default {
    /**
     * @Description:  存储数据
     * @param: key    键名
     * @param: value  键值
     * @param: merge  新旧数据是否合并
     */
    saveStorage: (key, value, merge = false) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * @Description: 获取数据
     * @param: key   键名
     */
    getStorage: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return localStorage.getItem(key);
        }
    },
    /**
     * @Description: 删除数据
     * @param: key   键名
     */
    removeStorage: (key) => {
        localStorage.removeItem(key);
    },
    clearStorage: () => {
        localStorage.clear();
    },
}