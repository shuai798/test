import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import OverviewData from './components/OverviewData';
import EquipmentOverview from './components/EquipmentOverview';
import OverviewEvent from './components/OverviewEvent';
import styles from './index.less';

class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={styles.lageBox}>
                <PageHeaderWrapper></PageHeaderWrapper>
                {/* 数据概览 */}
                <OverviewData props={this.props}></OverviewData>
                <div className="mt12" style={{ display: 'flex' }}>
                    {/* 设备概览 */}
                    <EquipmentOverview className="content"></EquipmentOverview>
                    {/* 事件概览 */}
                    <OverviewEvent className="content" history={this.props.history}></OverviewEvent>
                </div>
            </div>
        );
    }
}

export default TableView;
