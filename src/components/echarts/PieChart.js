import React, { Component } from 'react';
import echarts from 'echarts';
import indexStyle from './index.less';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.elref = React.createRef();
        this.pieChart = null;
        this.option = null;
    }

    componentDidMount () {
        this.initChart();
        window.addEventListener('resize', this.pieChart.resize);
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.pieChart.resize();
        }, 300);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.pieChart.resize);
    }

    initOption = () => {
        const option = {
            title: {
                show: true, // 是否显示标题组件。
                text: '访问来源', // 主标题文本。
                textAlign: 'auto', // 整体（包括 text 和 subtext）的水平对齐, 可选值：'auto'、'left'、'right'、'center'。
                textVerticalAlign: 'auto', // 整体（包括 text 和 subtext）的垂直对齐,可选值：'auto'、'top'、'bottom'、'middle'。
                padding: 5,
                itemGap: 10, // 主副标题之间的间距。
                left: 24, // grid 组件离容器左侧的距离。
                top: 16, // grid 组件离容器上侧的距离。
                right: 'auto', // grid 组件离容器右侧的距离。
                bottom: 'auto', // grid 组件离容器下侧的距离。
                backgroundColor: 'transparent', // 标题背景色，默认透明。
                borderColor: 'transparent', // 标题背景色，默认透明。
                borderWidth: 0, // 标题的边框线宽。
                borderRadius: 0, // 圆角半径，单位px，支持传入数组分别指定 4 个圆角半径。
                textStyle: {
                    color: 'rgba(0,0,0,0.85)', // 主标题文字的颜色。
                    fontStyle: 'normal', // 主标题文字字体的风格，可选'normal','italic','oblique'。
                    fontSize: 16, // 主标题文字的字体大小。
                    fontWeight: 500, // 主标题文字字体的粗细。
                    fontFamily: 'sans-serif', // 主标题文字的字体系列, 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
                    textBorderColor: 'transparent', // 文字本身的描边颜色。
                    textBorderWidth: 0, // 文字本身的描边宽度。
                },
                subtext: '', // 副标题文本。
                subtextStyle: {
                    color: '#aaa',
                    fontStyle: 'normal', // 主标题文字字体的风格，可选'normal','italic','oblique'。
                    fontSize: 12, // 主标题文字的字体大小。
                    fontWeight: 500, // 主标题文字字体的粗细。
                    fontFamily: 'sans-serif', // 主标题文字的字体系列, 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
                    align: 'left', // 文字水平对齐方式，默认自动,可选'left','center','right'。
                    verticalAlign: 'top', // 文字垂直对齐方式，默认自动,可选'top','middle','bottom'。
                    sublink: 'top', // 副标题文本超链接。
                    subtarget: 'top', // 指定窗口打开副标题超链接。可选：'self' 当前窗口打开,'blank' 新窗口打开。
                    lineHeight: 56, // 行高。
                    textBorderColor: 'transparent', // 文字本身的描边颜色。
                    textBorderWidth: 0, // 文字本身的描边宽度。
                },
            },
            backgroundColor: 'transparent',
            // color: ['#3787FF', '#F6973D'],
            textStyle: {
                color: '#999999',
            },
            /**
             * 直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。
             * 可以在网格上绘制折线图，柱状图，散点图（气泡图）
             */
            grid: {
                top: 60, // grid 组件离容器上侧的距离。
                right: 10, // grid 组件离容器右侧的距离。
                bottom: 30, // grid 组件离容器下侧的距离。
                left: 100, // grid 组件离容器左侧的距离。
            },
            tooltip: { // 提示框组件。
                /**
                 * 触发类型。
                 * 可选：
                 * 'item',数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                 * 'axis',坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                 * 在 ECharts 2.x 中只支持类目轴上使用 axis trigger，在 ECharts 3 中支持在直角坐标系和极坐标系上的所有类型的轴。
                 * 并且可以通过 axisPointer.axis 指定坐标轴。
                 * 'none',什么都不触发。
                 */
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)', // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
            },
            legend: {
                type: 'plain', // 普通图例。缺省就是普通图例。可选值：'plain'：普通图例。缺省就是普通图例。'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
                show: true, // 是否显示。
                left: 'auto', // 图例组件离容器左侧的距离。
                top: 15, // 图例组件离容器上侧的距离。
                right: 10, // 图例组件离容器右侧的距离。
                bottom: 'auto', // 图例组件离容器下侧的距离。
                orient: 'vertical', // 图例列表的布局朝向。
                align: 'auto', // 图例列表的布局朝向。可选：'auto','left','right'。
                padding: 5, // 图例内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
                itemGap: 10, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
                itemWidth: 12, // 图例标记的图形宽度。
                itemHeight: 4, // 图例标记的图形高度。
                formatter: name => { return name; }, // 用来格式化图例文本，支持字符串模板和回调函数两种形式。
                selected: { // 图例选中状态表。
                    直接访问: true,
                    邮件营销: true,
                    联盟广告: true,
                    视频广告: true,
                    搜索引擎: true,
                },
                /* 图例的数据数组。数组项通常为一个字符串，每一项代表一个系列的 name（如果是饼图，也可以是饼图单个数据的 name）。
                   图例组件会自动根据对应系列的图形标记（symbol）来绘制自己的颜色和标记，特殊字符串（空字符串）或者（换行字符串）用于图例的换行。
                   如果 data 没有被指定，会自动从当前系列中获取。多数系列会取自 series.name 或者 series.encode 的 seriesName 所指定的维度。
                   如 饼图 and 漏斗图 等会取自 series.data 中的 name。如果要设置单独一项的样式，也可以把该项写成配置项对象。
                   此时必须使用 name 属性对应表示系列的 name。 */
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
                textStyle: { // 图例的公用文本样式。
                    color: '#999999', // 文字的颜色。
                    fontStyle: 'normal', // 可选：'normal','italic','oblique'。
                    fontWeight: 'normal', // 文字字体的粗细。
                    fontFamily: 'sans-serif', // 主标题文字的字体系列, 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
                    backgroundColor: 'transparent', // 文字块背景色。可以是直接的颜色值，例如：'#123234', 'red', 'rgba(0,23,11,0.3)'。可以支持使用图片。
                    padding: 5, // 文字块的内边距。
                    borderColor: 'transparent', // 文字块边框颜色。
                    borderWidth: 0, // 文字块边框宽度。
                    borderRadius: 0, // 文字块的圆角。
                },
                tooltip: { // 图例的 tooltip 配置，配置项同 tooltip,默认不显示。
                    show: true,
                },
                icon: 'rect', // 图例项的 icon。ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。
                backgroundColor: 'transparent', // 图例背景色，默认透明。
                borderColor: 'transparent', // 图例的边框颜色。
                borderWidth: 0, // 图例的边框线宽。
                borderRadius: 0, // 圆角半径，单位px，支持传入数组分别指定 4 个圆角半径。
                animation: false, // 图例翻页是否使用动画。
                animationDurationUpdate: 800, // 图例翻页时的动画时长文字的颜色。
                /* 图例组件中的选择器按钮，目前包括全选和反选两种功能。默认不显示，用户可手动开启，
                   也可以手动配置每个按钮的标题,例：selector: true,selector: ['all', 'inverse']。 */
                selector: false,
                selectorLabel: { // 选择器按钮的文本标签样式，默认显示。
                    show: false, // 是否显示标签。
                    distance: 5, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
                    rotate: 0, // 标签旋转。从 -90 度到 90 度。正值是逆时针。
                    offset: [0, 0], // 是否对文字进行偏移。默认不偏移。
                    fontStyle: 'normal', // 文字字体的风格。
                    color: 'auto', // 文字的颜色。
                    fontWeight: 'normal', // 文字字体的粗细。
                    fontFamily: 'sans-serif', // 文字的字体系列。
                    fontSize: 12, // 文字的字体大小。
                    align: 'auto', // 文字水平对齐方式，默认自动，可选：'left'，'center'，'right'。
                    verticalAlign: 'auto', // 文字垂直对齐方式，默认自动,可选：'top','middle','bottom'。
                    lineHeight: 56, // 行高。
                    backgroundColor: 'transparent', // 文字块背景色。
                    borderColor: 'transparent', // 文字块边框颜色。
                    borderWidth: 0, // 文字块边框宽度。
                    borderRadius: 0, // 文字块的圆角。
                    padding: 5, // 文字块的内边距。
                },
                selectorPosition: 'auto', // 选择器的位置，可以放在图例的尾部或者头部，对应的值分别为 'end' 和 'start'。默认情况下，图例横向布局的时候，选择器放在图例的尾部；图例纵向布局的时候，选择器放在图例的头部。。
                selectorItemGap: 7, // 选择器按钮之间的间隔。
                selectorButtonGap: 10, // 选择器按钮与图例组件之间的间隔。
            },
            series: [ // 系列列表。每个系列通过 type 决定自己的图表类型
                {
                    name: '访问来源', // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    data: [ // 系列中的数据内容数组。数组项通常为具体的数据项。
                        {
                            value: 335,
                            name: '直接访问',
                        },
                        {
                            value: 310,
                            name: '邮件营销',
                        },
                        {
                            value: 234,
                            name: '联盟广告',
                        },
                        {
                            value: 135,
                            name: '视频广告',
                        },
                        {
                            value: 1548,
                            name: '搜索引擎',
                        },
                    ],
                    type: 'pie', // 类型
                    /**
                     * 饼图的半径。可以为如下类型：
                     * number：直接指定外半径值。
                     * string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。
                     * Array.<number|string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。
                     * 可以将内半径设大显示成圆环图（Donut chart）。
                     */
                    radius: '55%',
                    /**
                     * 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，
                     * 设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
                     */
                    center: ['50%', '60%'],
                    /**
                     * 当使用 dataset 时，seriesLayoutBy 指定了 dataset 中用行还是列对应到系列上，
                     * 也就是说，系列“排布”到 dataset 的行还是列上，可取值：'column'，'row'。
                     */
                    seriesLayoutBy: 'column',
                    emphasis: { // 高亮的扇区和标签样式。
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };

        return option;
    };

    initChart = () => {
        this.pieChart = echarts.init(this.elref.current);
        this.option = this.initOption();
        this.pieChart.setOption(this.option);
    }

    refreshChart = data => {
        // 校验参数合法性
        const dataSource = data || {};
        const { xData, seriesData } = dataSource;
        if (!xData || xData.length <= 0 || !seriesData || seriesData.length <= 0) {
            return;
        }
        this.barChart.setOption({
            xAxis: {
                data: xData,
            },
        });
    };

    render() {
        return (
            <div className={indexStyle.pieChartStyle} ref={this.elref} ></div>
        );
    }
}

export default PieChart;
