/**
 * @author sunbin@aixahc.com
 * @date 2020/8/18 1:44 下午
 */
import path from 'path';

const themeArr = [
    {
        name: 'dark',
        path: `${path.join(__dirname, '../src/assets/theme/dark.less')}`,
    },
    {
        name: 'light',
        path: `${path.join(__dirname, '../src/assets/theme/light.less')}`,
    },
];

export default themeArr;