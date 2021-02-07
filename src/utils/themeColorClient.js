import client from 'webpack-theme-color-replacer/client';
import generate from '@ant-design/colors/lib/generate';

export default {
    getAntdSerials(color) {
        const lightCount = 9;
        const divide = 10; // 淡化（即less的tint）
        let lightens = new Array(lightCount).fill(0);
        lightens = lightens.map((_, i) => { return client.varyColor.lighten(color, i / divide); });
        const colorPalettes = generate(color);
        return lightens.concat(colorPalettes);
    },

    changeColor(color) {
        if (!color) {
            return;
        }
        const options = {
            newColors: this.getAntdSerials(color),
            changeUrl(cssUrl) {
                return `/${cssUrl}`;
            },
        };
        client.changer.changeColor(options, Promise);
    },
};
