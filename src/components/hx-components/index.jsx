import React, { Component } from 'react';
import { Select, TreeSelect, Cascader, DatePicker, TimePicker, Icon } from 'antd';
import '@/assets/iconfont/iconfont'; // 使用离线iconfont

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class HxSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Select
                {...this.props}
                getPopupContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></Select>
        );
    }
}

class HxTreeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TreeSelect
                {...this.props}
                getPopupContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></TreeSelect>
        );
    }
}

class HxCascader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Cascader
                {...this.props}
                getPopupContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></Cascader>
        );
    }
}

class HxDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <DatePicker
                {...this.props}
                getCalendarContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></DatePicker>
        );
    }
}

class HxMonthPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <MonthPicker
                {...this.props}
                getCalendarContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></MonthPicker>
        );
    }
}

class HxRangePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <RangePicker
                {...this.props}
                getCalendarContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></RangePicker>
        );
    }
}

class HxWeekPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <WeekPicker
                {...this.props}
                getCalendarContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></WeekPicker>
        );
    }
}

class HxTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TimePicker
                {...this.props}
                getPopupContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                }}></TimePicker>
        );
    }
}

// iconfont彩色图标
class HxIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Icon {...this.props}>
                <use style={this.props.style} xlinkHref={`#${this.props.type}`}></use>
            </Icon>
        );
    }
}

export { HxSelect, HxTreeSelect, HxCascader, HxDatePicker, HxMonthPicker, HxRangePicker, HxWeekPicker, HxTimePicker, HxIcon };
