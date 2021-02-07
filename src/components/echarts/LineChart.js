import React, { Component } from 'react';
import echarts from 'echarts';
import indexStyle from './index.less';

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.elref = React.createRef();
        this.lineChart = null;
        this.option = null;
    }

    componentDidMount () {
        this.initChart();
        window.addEventListener('resize', this.lineChart.resize);
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.lineChart.resize();
        }, 300);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.lineChart.resize);
    }

    initOption = () => {
        const option = {
            title: {
                show: true, // 是否显示标题组件。
                text: '平台消息量', // 主标题文本。
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
            color: ['#3787FF', '#F6973D'],
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
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器配置项。
                    /**
                     * 指示器类型。可选
                     * 'line' 直线指示器
                     * 'shadow' 阴影指示器
                     * 'none' 无指示器
                     * 'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
                     */
                    type: 'cross',
                    label: { // 坐标轴指示器的文本标签。
                        backgroundColor: '#6a7985',
                    },
                },
            },
            legend: {
                type: 'plain', // 普通图例。缺省就是普通图例。可选值：'plain'：普通图例。缺省就是普通图例。'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
                show: true, // 是否显示。
                left: 'auto', // 图例组件离容器左侧的距离。
                top: 15, // 图例组件离容器上侧的距离。
                right: 10, // 图例组件离容器右侧的距离。
                bottom: 'auto', // 图例组件离容器下侧的距离。
                orient: 'horizontal', // 图例列表的布局朝向。
                align: 'auto', // 图例列表的布局朝向。可选：'auto','left','right'。
                padding: 5, // 图例内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
                itemGap: 10, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
                itemWidth: 12, // 图例标记的图形宽度。
                itemHeight: 4, // 图例标记的图形高度。
                formatter: name => { return name; }, // 用来格式化图例文本，支持字符串模板和回调函数两种形式。
                selected: { // 图例选中状态表。
                    上传量: true,
                    下发量: true,
                },
                /* 图例的数据数组。数组项通常为一个字符串，每一项代表一个系列的 name（如果是饼图，也可以是饼图单个数据的 name）。
                   图例组件会自动根据对应系列的图形标记（symbol）来绘制自己的颜色和标记，特殊字符串（空字符串）或者（换行字符串）用于图例的换行。
                   如果 data 没有被指定，会自动从当前系列中获取。多数系列会取自 series.name 或者 series.encode 的 seriesName 所指定的维度。
                   如 饼图 and 漏斗图 等会取自 series.data 中的 name。如果要设置单独一项的样式，也可以把该项写成配置项对象。
                   此时必须使用 name 属性对应表示系列的 name。 */
                data: ['上传量', '下发量'],
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
            /* 直角坐标系 grid 中的 x 轴，一般情况下单个 grid 组件最多只能放上下两个 x 轴，
               多于两个 x 轴需要通过配置 offset 属性防止同个位置多个 x 轴的重叠。 */
            xAxis: {
                show: true, // 是否显示 x 轴。
                /** 坐标轴类型。可选：
                   'value' 数值轴，适用于连续数据。
                   'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
                   'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，
                    例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
                   'log' 对数轴。适用于对数数据。
                 */
                type: 'category',
                name: '', // 坐标轴名称。
                nameLocation: 'end', // 坐标轴名称显示位置。可选：'start','middle' 或者 'center','end'。
                nameTextStyle: { // 坐标轴名称的文字样式。
                    color: 'auto', // 坐标轴名称的颜色
                    fontStyle: 'normal', // 坐标轴名称文字字体的风格
                },
                position: 'bottom', // x 轴的位置,可选：'top','bottom'。
                offset: 0, // X 轴相对于默认位置的偏移，在相同的 position 上有多个 X 轴的时候有用。
                /** 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
                    类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
                    非类目轴，包括时间，数值，对数轴，boundaryGap是一个两个值的数组，分别表示数据最小值和最大值的延伸范围，
                    可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效。 */
                boundaryGap: true,
                /**
                 * 坐标轴的分割段数，需要注意的是这个分割段数只是个预估值，
                 * 最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
                 * 在类目轴中无效。
                 */
                splitNumber: 5,
                splitLine: { // 坐标轴在 grid 区域中的分隔线。
                    show: false,
                },
                axisLine: { // 坐标轴轴线相关设置。
                    lineStyle: { // 线条样式。
                        color: 'rgba(69,120,230,0.14)',
                    },
                },
                /**
                 * 类目数据，在类目轴（type: 'category'）中有效。
                 * 如果没有设置 type，但是设置了 axis.data，则认为 type 是 'category'。如果设置了 type 是 'category'，
                 * 但没有设置 axis.data，则 axis.data 的内容会自动从 series.data 中获取，这会比较方便。
                 * 不过注意，axis.data 指明的是 'category' 轴的取值范围。如果不指定而是从 series.data 中获取，
                 * 那么只能获取到 series.data 中出现的值。比如说，假如 series.data 为空时，就什么也获取不到。
                 */
                data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
            },
            /**
             * 直角坐标系 grid 中的 y 轴，一般情况下单个 grid 组件最多只能放左右两个 y 轴，
             * 多于两个 y 轴需要通过配置 offset 属性防止同个位置多个 Y 轴的重叠。
             */
            yAxis: {
                type: 'value', // 坐标轴类型。
                splitLine: { // 坐标轴在 grid 区域中的分隔线。
                    show: true,
                    lineStyle: { // 线条样式。
                        color: 'rgba(69,120,230,0.14)',
                    },
                },
                axisLine: { // 坐标轴轴线相关设置。
                    lineStyle: { // 线条样式。
                        color: 'rgba(69,120,230,0.14)',
                    },
                },
            },
            series: [ // 系列列表。每个系列通过 type 决定自己的图表类型
                {
                    name: '上传量', // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    data: [1000, 2000, 1500, 3000, 2000, 1200, 800], // 系列中的数据内容数组。数组项通常为具体的数据项。
                    type: 'line', // 线性
                    smooth: true, // 是否平滑曲线显示。
                    step: false, // 是否是阶梯线图。可以设置为 true 显示成阶梯线图，也支持设置成 'start', 'middle', 'end' 分别配置在当前点，当前点与下个点的中间点，下个点拐弯。
                    /**
                     * 当使用 dataset 时，seriesLayoutBy 指定了 dataset 中用行还是列对应到系列上，
                     * 也就是说，系列“排布”到 dataset 的行还是列上，可取值：'column'，'row'。
                     */
                    seriesLayoutBy: 'column',
                    itemStyle: {
                        // color: 'auto', // 图形的颜色。
                        // borderColor: 'auto', // 图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                        borderWidth: 1, // 描边线宽。为 0 时无描边。。
                        borderType: 'solid', // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                        opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    },
                    lineStyle: { // 线条样式。
                        /* 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
                           如果 globalCoord 为 `true`，则该四个值是绝对的像素位置 */
                        color: { // 线的颜色。
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(0,255,160,1)', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,131,255,1)', // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                        width: 2, // 线宽。
                        type: 'solid', // 线的类型,可选：'solid','dashed','dotted'。
                        opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    },
                    areaStyle: { // 区域填充样式。
                        /* 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
                            如果 globalCoord 为 `true`，则该四个值是绝对的像素位置 */
                        color: { // 填充的颜色。
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 245, 255, 0.5)', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(34, 44, 255, 0.2)', // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                        origin: 'auto', // 图形区域的起始位置。
                        opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    },
                },
                {
                    name: '下发量', // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    data: [500, 200, 150, 300, 200, 120, 80], // 系列中的数据内容数组。数组项通常为具体的数据项。
                    type: 'line', // 线性。
                    lineStyle: { // 线条样式。
                        color: '#FF9E00',
                    },
                },
            ],
        };
        return option;
    };

    initChart = () => {
        this.lineChart = echarts.init(this.elref.current);
        this.option = this.initOption();
        this.lineChart.setOption(this.option);
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
            <div className={indexStyle.lineChartStyle} ref={this.elref} ></div>
        );
    }
}

export default LineChart;
