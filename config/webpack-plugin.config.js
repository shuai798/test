// Change theme plugin
// eslint-disable-next-line eslint-comments/abdeils - enable - pair;

/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import generate from '@ant-design/colors/lib/generate';
import ThemeColorReplacer from 'webpack-theme-color-replacer';

function getModulePackageName(module) {
    if (!module.context) return null;
    const nodeModulesPath = path.join(__dirname, '../node_modules/');

    if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
        return null;
    }

    const moduleRelativePath = module.context.substring(nodeModulesPath.length);
    const [moduleDirName] = moduleRelativePath.split(path.sep);
    let packageName = moduleDirName; // handle tree shaking

    if (packageName && packageName.match('^_')) {
        // eslint-disable-next-line prefer-destructuring
        packageName = packageName.match(/^_(@?[^@]+)/)[1];
    }

    return packageName;
}

const getAntdSerials = color => {
    const lightNum = 9;
    const devide10 = 10; // 淡化（即less的tint）

    const lightens = new Array(lightNum).fill(undefined).map((_, i) => ThemeColorReplacer.varyColor.lighten(color, i / devide10));
    const colorPalettes = generate(color);
    return lightens.concat(colorPalettes);
};

export default (config, { webpack }) => {
    config.plugin('webpack-theme-color-replacer').use(ThemeColorReplacer, [
        {
            fileName: 'css/theme-colors-[contenthash:8].css',
            matchColors: getAntdSerials('#0086FF'),

            // 主色系列
            // 改变样式选择器，解决样式覆盖问题
            changeSelector(selector) {
                switch (selector) {
                    case '.ant-calendar-today .ant-calendar-date':
                        return `:not(.ant-calendar-selected-date)${selector}`;

                    case '.ant-btn:focus,.ant-btn:hover':
                        return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)';

                    case '.ant-btn.active,.ant-btn:active':
                        return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)';

                    default:
                        return selector;
                }
            },
        },
    ]);

    config.nodeModulesTransform = {
        type: 'none',
        exclude: [],
    };
    config.externals = {
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
    };
    config.resolve.alias.set("react-dom", '@hot-loader/react-dom');
    config.devServer.hot(true);
    config.devtool('eval');
    new webpack.HotModuleReplacementPlugin()
    // preview.pro.ant.design only do not use in your production;

    config.optimization // share the same chunks across different modules
        .runtimeChunk(false)
        .splitChunks({
            chunks: 'async',
            name: 'vendors',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendors: {
                    test: module => {
                        const packageName = getModulePackageName(module);

                        if (packageName) {
                            return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
                        }

                        return false;
                    },

                    name(module) {
                        const packageName = getModulePackageName(module);

                        if (packageName) {
                            if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                                return 'viz'; // visualization package
                            }
                        }

                        return 'misc';
                    },
                },
            },
        });
};
