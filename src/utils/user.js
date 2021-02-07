/**
 * @author sunbin@aixahc.com
 * @date 2020/8/14 1:21 下午
 */
import storage from '@/utils/storage';

export default {
    checkLogin: () => {
        return !!storage.getStorage('authorization');
    }
}