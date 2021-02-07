import { Row, Col, Modal, Form } from 'antd';
import React from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';
import { HxTreeSelect } from '@/components/hx-components';

const FormItem = Form.Item;

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
        this.state = {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'formTableSpace/getSystemDataInfo',
        });
    }

    handleEdit = () => {
        const { form, dispatch, editComplete } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'formTableSpace/addTableInfo',
                payload: {
                    ...fieldsValue,
                },
                callback: () => {
                    if (editComplete) {
                        editComplete();
                    }
                },
            });
        });
    };

    cancelModal = () => {
        const { cancelModal } = this.props;
        if (cancelModal) {
            cancelModal();
        }
    };

    render() {
        const { form: { getFieldDecorator }, id, formTableSpace: { loadingAdd, loadingEdit } } = this.props;
        return (
            <div>
                <Modal
                    title="新增分组" confirmLoading={id ? loadingEdit : loadingAdd} destroyOnClose visible
                    maskClosable={false} onOk={this.handleAdd} onCancel={this.cancelModal} width={800}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex" gutter={{ md: 8, lg: 12 }}>
                                <Row style={{ padding: 10 }}>
                                    <Col xs={24} md={12}>
                                        <FormItem label="所属系统">
                                            {getFieldDecorator('subSystemId', {
                                                rules: [
                                                    {
                                                        validator: validate.RuleName,
                                                    },
                                                ],
                                            })(
                                                <HxTreeSelect></HxTreeSelect>,
                                            )}
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
