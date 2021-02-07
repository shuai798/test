import { Row, Col, Modal, Form, Input, Radio } from 'antd';
import React from 'react';
import { connect } from 'dva';
import Api from '@/utils/api';
import validate from '@/utils/validation';
import { HxTreeSelect } from '@/components/hx-components';
import indexStyle from '../index.less';

const FormItem = Form.Item;

const statusOption = [
    { label: '启用', value: 'VALID' },
    { label: '禁用', value: 'INVALID' },
];

@connect(({ loading, formTableSpace }) => {
    return {
        formTableSpace,
        loadingAdd: loading.effects['formTableSpace/addTableInfo'],
    };
})
@Form.create()
class AddFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'formTableSpace/getSystemDataInfo',
            callback: () => {
                const { formTableSpace: { systemDataList } } = this.props;
                this.changeDataToTreeSelect(systemDataList, '');
                this.setState({
                    dataSource: systemDataList,
                });
            },
        });
    }

    changeDataToTreeSelect = (dataList, name) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].value = list[i].id;
                list[i].title = list[i].name;
                // 用于回显全路径
                list[i].newValue =
                    name !== ''
                        ? `${name} / ${list[i].name}`
                        : list[i].name;
                if (list[i].children) {
                    list[i].children =
                        this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                }
            }
        }
        return list;
    };

    handleAdd = () => {
        const { form, dispatch, addTableListOK } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) { return; }
            dispatch({
                type: 'formTableSpace/addTableInfo',
                payload: {
                    ...fieldsValue, name: fieldsValue.name.trim(),
                },
                callback: () => {
                    addTableListOK();
                },
            });
        });
    };

    cancelAdd = () => {
        this.props.hideAddModal();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Modal title="新增分组" confirmLoading={this.props.loadingAdd} destroyOnClose visible maskClosable={false} onOk={this.handleAdd} onCancel={this.cancelAdd} width={800}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex" gutter={{ md: 8, lg: 12, xl: 24 }}>
                                <Row style={{ padding: 10 }}>
                                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <FormItem label="所属系统">
                                            {getFieldDecorator('subSystemId', {
                                                rules: [
                                                    {
                                                        message: '该项不能为空',
                                                        required: true,
                                                    },
                                                ],
                                            })(
                                                <HxTreeSelect style={{ maxHeight: 200, overflow: 'overlay' }} treeData={this.state.dataSource} showSearch treeNodeLabelProp="newValue" placeholder="请选择系统名称" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']}></HxTreeSelect>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="分组名称">
                                            {getFieldDecorator('name', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: '该项不能为空',
                                                    },
                                                    {
                                                        validator: validate.Rule_name,
                                                    },
                                                ],
                                            })(<Input placeholder="请输入" maxLength={20}></Input>)}
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="分组编码">
                                            {getFieldDecorator('no', {
                                                rules: [
                                                    {
                                                        message: '该项不能为空',
                                                        required: true,
                                                    },
                                                    {
                                                        validator: validate.Rule_name,
                                                    },
                                                ],
                                                getValueFromEvent:
                                                    event => { return Api.trimStr(event.target.value); },
                                            })(<Input placeholder="请输入" maxLength={20}></Input>)}
                                        </FormItem>
                                    </Col>
                                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <FormItem label="备注信息">
                                            {getFieldDecorator('remarks', {},
                                            )(<Input placeholder="请输入" maxLength={100}></Input>)}
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="管理状态">
                                            {getFieldDecorator('managementStatus', {
                                                initialValue: 'VALID',
                                            })(<Radio.Group options={statusOption} ></Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddFormModal;
