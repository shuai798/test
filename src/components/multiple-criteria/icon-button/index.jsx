/*
 * @Author: wangdi
 * @Date: 2020-04-22 10:52:19
 * @Last Modified by: wangdi
 * @Last Modified time: 2020-04-22 14:32:23
 */
import React, { Component } from 'react';
import { Button, Icon } from 'antd';

class IconButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="content">
                <Button type="primary">
                    <span className="iconfont icon-add mr8 fz14"></span>新增
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-search mr8 fz14"></span>查询
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-refresh mr8 fz14"></span>刷新
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-edit mr8 fz14"></span>编辑
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-save mr8 fz14"></span>保存
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-import mr8 fz14"></span>导入
                </Button>
                <div className="mt24"></div>
                <Button type="primary">
                    <span className="iconfont icon-export mr8 fz14"></span>导出
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-stopped mr8 fz14"></span>停用
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-remained mr8 fz14"></span>提醒接单
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-hourglass mr8 fz14"></span>开始处理
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-complete mr8 fz14"></span>处理完成
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-configure mr8 fz14"></span>分配
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-send mr8 fz14"></span>发送
                </Button>
                <div className="mt24"></div>
                <Button type="primary">
                    <span className="iconfont icon-upload mr8 fz14"></span>重置
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-download mr8 fz14"></span>重置
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-reset mr8 fz14"></span>重置
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-fadeback mr8 fz14"></span>反馈
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-print mr8 fz14"></span>打印
                </Button>
                <Button type="primary" className="ml8">
                    <span className="iconfont icon-record mr8 fz14"></span>记录
                </Button>
            </div>
        );
    }
}

export default IconButton;
