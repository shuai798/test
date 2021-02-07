import React from 'react';
import { Form, Row, Col, Input, Modal } from 'antd';
import { connect } from 'dva';
import validate from '@/utils/validation';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ loading, dataDictionarySpace }) => {
    return {
        dataDictionarySpace,
        editLoading: loading.effects['dataDictionarySpace/editDataDictionaryItem'],
    };
})
class EditDataDictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '', // 名字重复性校验
        };
    }

    componentDidMount() {
        const {
            editRecord,
        } = this.props;

        this.setState({
            name: editRecord.name,
        });
    }

    editShow = () => {
        const { form } = this.props;

        form.validateFields((err, values) => {
            if (err) { return; }
            this.props.editOk(values);
        });
    };

    editCancel = () => {
        this.props.editShow();
    }

    // 名字重复性校验
    checkName = (rule, value, callback) => {
        const { name } = this.state;
        const { editRecord } = this.props;

        if (value === undefined || value === '' || value.trim() === '') {
            this.props.form.setFieldsValue({
                name: undefined,
            });
            callback();
        } else if (name === value) {
            callback();
        } else {
            const { dispatch } = this.props;
            dispatch({
                type: 'dataDictionarySpace/checkDataDictionaryName',
                payload: {
                    name: value,
                    id: editRecord.id,
                },
                callback: result => {
                    if (result) {
                        callback('该名称已存在');
                    } else {
                        callback();
                    }
                },
            });
        }
    }

    render() {
        const {
            form: { getFieldDecorator },
            editRecord,
        } = this.props;

        return (
            <Modal title="编辑" visible destroyOnClose confirmLoading={this.props.editLoading} onOk={this.editShow} onCancel={this.editCancel}>
                <div className="formList100">
                    <Row type="flex" gutter={{ md: 8, lg: 12, xl: 24 }}>
                        <FormItem className="dp-none">
                            {getFieldDecorator('id', {
                                initialValue: editRecord ? editRecord.id : '',
                            })(<Input />)}
                        </FormItem>
                        <FormItem className="dp-none">
                            {getFieldDecorator('version', {
                                initialValue: editRecord ? editRecord.version : '',
                            })(<Input />)}
                        </FormItem>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <FormItem label="字典项名称">
                                {getFieldDecorator('name', {
                                    validate: [
                                        {
                                            trigger: 'onChange',
                                            rules: [validate.Rule_require],
                                        },
                                        {
                                            trigger: 'onBlur', // 失去焦点做名称重复性校验
                                            rules: [{ validator: this.checkName }],
                                        },
                                    ],
                                    initialValue: editRecord ? editRecord.name : undefined,
                                })(<Input placeholder="请选择" maxLength={32}></Input>)}
                            </FormItem>
                        </Col>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <FormItem label="说明">
                                {getFieldDecorator('remarks', {
                                    rules: [validate.Rule_require],
                                    initialValue: editRecord ? editRecord.remarks : undefined,
                                })(<TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 10 }} maxLength={255}></TextArea>)}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    }
}

export default EditDataDictionary;
