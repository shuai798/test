import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Icon, Form, Modal, Divider, Descriptions } from 'antd';
import { connect } from 'dva';
import SearchForm from './components/SearchForm';
import AddFormModal from './components/AddFormModal';
import EditFormModal from './components/EditFormModal';
import styles from './index.less';

const { confirm } = Modal;

// @connect(({ loading, formTableSpace }) => {
//     return {
//         formTableSpace
//     };
// })
@Form.create()
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            addFormModalVisible: false,
            editFormModalVisible: false,
            tableItemRecord: {},
            searchParam: {},
        };
    }

    componentDidMount = () => {
        // this.getTableViewList(0);
    };

    render() {
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content mt20">
                    <Descriptions title="测试" bordered column={1} className={styles.descriptions}>
                        <Descriptions.Item label="Product">Cloud Database <Icon className="fr" type="edit" theme="twoTone"></Icon></Descriptions.Item>
                        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
                        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
                        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
                        <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
                        <Descriptions.Item label="Official">$60.00</Descriptions.Item>
                    </Descriptions>
                </div>
                <Button type="primary">按钮</Button>
            </div>
        );
    }
}

export default TableView;
