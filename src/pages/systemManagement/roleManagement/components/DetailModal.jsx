import React from 'react';
import { Modal, Form, Row, Col, Tree } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';

const FormItem = Form.Item;
@connect()
@Form.create()
class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceIds: [],
            treeDataSource: [],
        };
    }

    componentDidMount() {
        this.getdetailList();
    }

    getdetailList = () => {
        const { dispatch, detailRecord } = this.props;
        dispatch({
            type: 'roleMangementSpace/getDetailRecord',
            payload: { id: detailRecord.id },
            callback: (response) => {
                this.setState(
                    {
                        resourceIds: response.data.resourceIds,
                    },
                    () => {
                        const menuList = JSON.parse(localStorage.getItem('menuTree'));
                        const oneDimensional = [];
                        const newDataId = [];
                        const dataSource = [];
                        this.dataOneDimensional(menuList, oneDimensional);
                        this.newTreeData(oneDimensional, newDataId);
                        this.loop(menuList, newDataId, dataSource);
                        this.setState({
                            treeDataSource: dataSource,
                        });
                    },
                );
            },
        });
    };

    dataOneDimensional = (menuData, dataSource) => {
        menuData.map((item) => {
            if (item.children && item.children !== []) {
                return dataSource.push(...[item, ...item.children]);
            }
            return dataSource.push(item);
        });
    };

    newTreeData = (data, list) => {
        const { resourceIds } = this.state;
        data.map((item) => {
            if (resourceIds.indexOf(item.id) !== -1) {
                return list.push(...[item.id, item.parentId]);
            }
        });
    };

    loop = (data, resourceIds, list) => {
        return data.map((item) => {
            const children = [];
            if (item.children && item.children !== []) {
                this.loop(item.children, resourceIds, children);
            }
            if (resourceIds.indexOf(item.id) !== -1) {
                list.push({ ...item, title: item.name, key: item.id, children });
            }
            return list;
        });
    };

    clickCancel = () => {
        this.props.detailShow();
    };

    render() {
        const { detailRecord } = this.props;
        const { treeDataSource } = this.state;
        return (
            <div className={styles.modalCss}>
                <Modal title="角色详情" centered width={542} visible onCancel={this.clickCancel} maskClosable={false} getContainer={false} footer={false}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex">
                                <Col>
                                    <FormItem label="角色名称">{detailRecord?.name || '--'}</FormItem>
                                </Col>
                            </Row>
                            <Row type="flex">
                                <Col>
                                    <FormItem label="管理状态">{detailRecord?.disable ? '禁用' : '启用'}</FormItem>
                                </Col>
                            </Row>
                            <Row type="flex">
                                <Col>
                                    <div className={styles.menuRole}>菜单权限</div>
                                    <div className={styles.treeStyle}>{treeDataSource && treeDataSource.length > 0 ? <Tree treeData={treeDataSource} defaultExpandAll></Tree> : null}</div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddItem;
