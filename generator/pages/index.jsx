import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Layout, Button, Breadcrumb, Icon, Row, Col, Form, Select, Input, Table, Modal, Message, DatePicker, TreeSelect, ConfigProvider, TimePicker } from 'antd';
import logo from '@/assets/images/logo.svg';
import validation from '@/utils/validation';
import request from '@/utils/request';
import { HxSelect, HxCascader, HxDatePicker, HxMonthPicker, HxRangePicker, HxWeekPicker, HxTreeSelect, HxTimePicker } from '@/components/hx-components';
import ReactJson from 'react-json-view';
import { language } from '@/locales/locales';
import styles from './index.less';
import routerData from '../../config/router';
import FilterSelectAllTable from '@/components/filter-selectall-table';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { TextArea } = Input;

const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

const tmpValidation = [];
// eslint-disable-next-line guard-for-in,no-restricted-syntax
for (const k in validation) {
    tmpValidation.push({
        name: k,
        value: k,
    });
}
const allComponent = {
    Input,
    Select,
    DatePicker,
    MonthPicker,
    TreeSelect,
    RangePicker,
    WeekPicker,
    TimePicker,
    HxSelect,
    HxCascader,
    HxDatePicker,
    HxTimePicker,
    HxMonthPicker,
    HxRangePicker,
    HxWeekPicker,
    HxTreeSelect,
};

const optionData = {
    labelWidth: [{
        name: '80',
        value: 'formList80',
    }, {
        name: '100',
        value: 'formList100',
    }, {
        name: '140',
        value: 'formList140',
    }],
    validation: tmpValidation,
    formItemType: [{
        name: '输入',
        value: 'Input',
    }, {
        name: '选择',
        value: 'Select',
    }, {
        name: '选择日期',
        value: 'DatePicker',
    }, {
        name: '选择时间',
        value: 'TimePicker',
    }, {
        name: '选择日期(时分秒)',
        value: 'DatePicker-showTime',
    }, {
        name: '选择周',
        value: 'WeekPicker',
    }, {
        name: '选择月份',
        value: 'MonthPicker',
    }, {
        name: '选择日期范围',
        value: 'RangePicker',
    }, {
        name: '选择日期范围(时分秒)',
        value: 'RangePicker-showTime',
    }, {
        name: '选择树',
        value: 'TreeSelect',
    }],
    tableBtn: [{
        name: '新增',
        value: 'add',
    },
    {
        name: '导出',
        value: 'export',
    },
    {
        name: '导入',
        value: 'import',
    }],
    tableOperation: [{
        name: '详情',
        value: 'detail',
    }, {
        name: '编辑',
        value: 'edit',
    },
    {
        name: '删除',
        value: 'delete',
    }],
    align: [{
        name: '左对齐',
        value: 'left',
    },
    {
        name: '居中对齐',
        value: 'center',
    },
    {
        name: '右对齐',
        value: 'right',
    }],
    fixed: [{
        name: '左固定',
        value: 'left',
    }, {
        name: '右固定',
        value: 'right',
    }, {
        name: '不固定',
        value: '',
    }],
    modalType: [{
        name: '新增与编辑',
        value: 'addAndEdit',
    }, {
        name: '详情',
        value: 'detail',
    }, {
        name: '其他',
        value: 'other',
    }],
    modalWidth: [{
        name: '800',
        value: '800',
    }, {
        name: '600',
        value: '600',
    }],
    modalShow: [{
        name: '是',
        value: 'true',
    },
    {
        name: '否',
        value: 'false',
    }],
};

const componentData = {
    search: {
        hasChildren: true,
        children: [],
        allowChildrenType: 'formItem',
        attr: [{
            label: '标签宽度',
            type: 'select',
            key: 'labelWidth',
            multiple: false,
            id: uuidv4(),
        }],
    },
    formItem: {
        hasChildren: false,
        attr: [{
            label: '标签名称',
            type: 'input',
            key: 'title',
            id: uuidv4(),
        }, {
            label: '字段',
            type: 'input',
            key: 'fieldName',
            id: uuidv4(),
        }, {
            label: '类型',
            type: 'select',
            key: 'formItemType',
            multiple: false,
            id: uuidv4(),
        }, {
            label: '校验',
            type: 'select',
            key: 'validation',
            multiple: true,
            id: uuidv4(),
        }],
    },
    table: {
        hasChildren: true,
        pagination: true,
        children: [],
        allowChildrenType: 'columns',
        attr: [{
            label: '标题',
            type: 'input',
            key: 'title',
            id: uuidv4(),
        }, {
            label: '列表url',
            type: 'input',
            key: 'apiUrl',
            id: uuidv4(),
        },
        {
            label: '标题按钮',
            type: 'select',
            key: 'tableBtn',
            multiple: true,
            id: uuidv4(),
        }, {
            label: '操作',
            type: 'select',
            key: 'tableOperation',
            multiple: true,
            id: uuidv4(),
        }],
    },
    columns: {
        hasChildren: false,
        attr: [{
            label: '名称',
            type: 'input',
            key: 'title',
            id: uuidv4(),
        }, {
            label: '字段',
            type: 'input',
            key: 'dataIndex',
            id: uuidv4(),
        }, {
            label: '宽度',
            type: 'input',
            key: 'width',
            id: uuidv4(),
        }, {
            label: '对齐方式',
            type: 'select',
            key: 'align',
            id: uuidv4(),
        }, {
            label: '是否固定',
            type: 'select',
            key: 'fixed',
            id: uuidv4(),
        }],
    },
    modal: {
        hasChildren: true,
        children: [],
        allowChildrenType: 'modalFormItem',
        attr: [{
            label: '标题',
            type: 'input',
            key: 'title',
            id: uuidv4(),
        }, {
            label: '宽度',
            type: 'select',
            key: 'modalWidth',
            id: uuidv4(),
        }, {
            label: 'modal类型',
            type: 'select',
            key: 'modalType',
            id: uuidv4(),
        }, {
            label: '标签宽度',
            type: 'select',
            key: 'labelWidth',
            id: uuidv4(),
        }, {
            label: '是否展示',
            type: 'select',
            key: 'modalShow',
            id: uuidv4(),
        }],
    },
    modalFormItem: {
        hasChildren: false,
        attr: [{
            label: '标签名称',
            type: 'input',
            key: 'title',
            id: uuidv4(),
        }, {
            label: '字段',
            type: 'input',
            key: 'fieldName',
            id: uuidv4(),
        }, {
            label: '类型',
            type: 'select',
            key: 'formItemType',
            multiple: false,
            id: uuidv4(),
        }, {
            label: '校验',
            type: 'select',
            key: 'validation',
            multiple: true,
            id: uuidv4(),
        }],
    },
    modalDetailItem: {
        hasChildren: false,
        attr: [{
            label: '标签名称',
            type: 'input',
            key: 'title',
            id: uuidv4(),
        }, {
            label: '字段',
            type: 'input',
            key: 'fieldName',
            id: uuidv4(),
        }],
    },
};
const page = {
    children: [],
};
// const page = { children: [{ type: 'search', id: 'b9791f39-decf-4a3f-ac9d-e4f40e588bc3', children: [{ type: 'formItem', id: 'df5fb1c8-fc25-407d-a63b-4cd9512b7505', title: '编码', fieldName: 'code', formItemType: 'Input', validation: null }, { type: 'formItem', id: '3b745c4e-6a8b-4e4c-b668-81114b47c7f6', title: '名称', fieldName: 'name', formItemType: 'Input', validation: null }, { type: 'formItem', id: 'cfaa268c-2a7c-4665-a566-2358082e2dc7', title: '类型', fieldName: 'type', formItemType: 'Select', validation: null, selectOptionData: [{ value: 'CONTRACT_INFORMATION', name: '合同信息' }, { value: 'HOUSING_INFORMATION', name: '房源信息' }, { value: 'LESSEE_INFORMATION', name: '租客信息' }, { value: 'LESSEE_BILLING_INFORMATION', name: '租客开票信息' }] }], labelWidth: 'formList80' }, { type: 'table', id: '56dd3b04-483c-4db2-a18e-fb1aa0e3b7ef', children: [{ type: 'columns', id: '5cfda0e6-9cfe-47ba-8802-73a851c3eaf0', title: '编码', dataIndex: 'code', width: 0, align: 'left', fixed: '' }, { type: 'columns', id: '589e18cd-d962-411b-a71d-52f4dfda9ab7', title: '名称', dataIndex: 'name', width: 0, align: 'left', fixed: '' }, { type: 'columns', id: 'cee37c28-2763-45f4-8c5b-dfaa39deaf72', title: '类型', dataIndex: 'type', width: 0, align: 'left', fixed: '' }], title: '关键字列表', apiUrl: '/contract/contract/contract/w/contractTemplateKey/s', tableBtn: ['add'], tableOperation: ['detail', 'edit', 'delete'], deleteUrl: '/contract/contract/contract/w/contractTemplateKey/' }, { type: 'modal', id: '8808af74-2535-4484-a49e-eda65131c399', children: [{ type: 'modalFormItem', id: '8e9fbc0f-bb64-4811-bfec-2baeabfe35e6', title: '编码', fieldName: 'code', formItemType: 'Input', validation: ['Rule_require'] }, { type: 'modalFormItem', id: '015be221-1210-4894-a759-e2dff44762a4', title: '名称', fieldName: 'name', formItemType: 'Input', validation: ['Rule_require'] }, { type: 'modalFormItem', id: '0a633de6-dc01-4810-8ea2-c80f91b92a40', title: '类型', fieldName: 'type', formItemType: 'Select', validation: ['Rule_require'], selectOptionData: [{ value: 'CONTRACT_INFORMATION', name: '合同信息' }, { value: 'HOUSING_INFORMATION', name: '房源信息' }, { value: 'LESSEE_INFORMATION', name: '租客信息' }, { value: 'LESSEE_BILLING_INFORMATION', name: '租客开票信息' }] }], title: '新增合同模板关键字', modalWidth: '800', modalType: 'addAndEdit', labelWidth: 'formList80', modalShow: 'false', addUrl: ' /contract/contract/contract/w/contractTemplateKey', detailUrl: '/contract/contract/contract/w/contractTemplateKey/', editUrl: '/contract/contract/contract/w/contractTemplateKey/' }, { type: 'modal', id: '3c9f6620-ebb1-4771-b5b6-8ee19908c1b6', children: [{ type: 'modalDetailItem', id: 'ec2dc527-1e9c-4b86-8a75-ca0a289c8916', title: '编码', fieldName: 'code' }, { type: 'modalDetailItem', id: '714f2f59-80aa-46c0-881b-a53cfad2a08e', title: '名称', fieldName: 'name' }, { type: 'modalDetailItem', id: '003a78cd-2b36-47fd-b7f7-18afb21c87a6', title: '类型', fieldName: 'type' }], title: '详情', modalWidth: '800', modalType: 'detail', labelWidth: 'formList80', modalShow: 'true', detailUrl: '/contract/contract/contract/w/contractTemplateKey/' }] };
let selectNode = null;

@Form.create()
class Generator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dirArr: [],
            routerPath: '',
            areaJson: '',
        };
    }

    componentDidMount() {
        this.generateDir();
    }

    cycle = (data) => {
        const temp = [];
        data.forEach(item => {
            if (item.routes && item.routes.length > 0) {
                if (item.name) {
                    temp.push({
                        value: item.path,
                        label: item.name,
                        children: this.cycle(item.routes),
                    });
                }
            }
        });

        return temp;
    };


    onChange = (e, type) => {
        e.stopPropagation();
        this.state.page[type].exist = e.target.checked;
    };

    generate = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async () => {
        const data = {
            page,
            path: this.props.form.getFieldValue('generatorPath'),
            name: this.props.form.getFieldValue('generatorName'),
            router: this.state.routerPath,
            routerName: this.props.form.getFieldValue('generatorRouterName'),
        };
        const res = await request('/generator/create', {
            method: 'POST',
            data,
        });

        if (res?.success) {
            Message.success('生成成功');
            // this.setState({
            //     visible: false,
            // });
        } else {
            Message.error(res.message || '生成失败');
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    generateDir = async () => {
        const res = await request('/generator/getDirArr', {
            method: 'POST',
        });
        if (res) {
            this.setState({
                dirArr: res.data,
            });
        }
    };

    addNode = (container, type) => {
        container.children.push({
            type,
            id: uuidv4(),
        });
        if (componentData[type].hasChildren) {
            container.children[container.children.length - 1].children = [];
        }
        componentData[type].attr.forEach(item => {
            container.children[container.children.length - 1][item.key] = null;
        });
        componentData[type].attr.forEach(item1 => {
            item1.id = uuidv4();
        });
        if (type === 'formItem') {
            container.children[container.children.length - 1].formItemType = 'Input';
        }
        if (type === 'modalFormItem') {
            container.children[container.children.length - 1].formItemType = 'Input';
        }
        if (type === 'search') {
            container.children[container.children.length - 1].labelWidth = 'formList80';
        }
        if (type === 'modal') {
            container.children[container.children.length - 1].modalType = 'addAndEdit';
            container.children[container.children.length - 1].title = '新增';
            container.children[container.children.length - 1].modalWidth = '800';
            container.children[container.children.length - 1].modalShow = 'true';
            container.children[container.children.length - 1].labelWidth = 'formList80';
        }

        if (type === 'modalDetailItem') {
            container.children[container.children.length - 1].title = '名称';
        }
        // console.log(111, page);
        // selectNode = null;
        selectNode = container.children[container.children.length - 1];
        this.setState({});
    };

    selectNode = (item) => {
        componentData[item.type].attr.forEach(item1 => {
            item1.id = uuidv4();
        });

        selectNode = item;
        console.log(11111, item);
        if (item.formItemType === 'Select' || item.formItemType === 'TreeSelect') {
            this.setState({
                areaJson: JSON.stringify(item.selectOptionData),
            });
        } else {
            this.setState({
                areaJson: '',
            });
        }
        this.setState({});
    };

    deleteNode = (pageData, index) => {
        pageData.children.splice(index, 1);
        this.setState({});
    };

    updateData = (key, value) => {
        selectNode[key] = value;
        if (key === 'fixed' && value === 'false') {
            selectNode[key] = false;
        }
        if (key === 'modalType') {
            if (value === 'addAndEdit') {
                selectNode.title = '新增';
            } else if (value === 'detail') {
                selectNode.title = '详情';
            } else {
                selectNode.title = '其他';
            }
            selectNode.children = [];
        }
        console.log('selectNode', selectNode);
        this.setState({});
    };

    treeElement = (pageData, level) => {
        if (!level) {
            level = 0;
        }
        return pageData?.children && pageData.children.length > 0 ? pageData.children.map((item, index) => {
            return <div
                key={item.id}
                className={[level === 0 ? 'mt5' : ''].join(' ')}>
                <div
                    className={[styles.pageDataItem, item.id === selectNode?.id ? styles.pageDataItemActive : '', 'pl8', 'pr8'].join(' ')}>
                    <div
                        style={{
                            paddingLeft: level * 10,
                            paddingRight: 10,
                            cursor: 'pointer',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }} className={styles.pageDataItemTitle}
                        onClick={() => {
                            this.selectNode(item);
                        }}>{item.title || item.type}</div>
                    {
                        componentData[item.type].hasChildren ? <Button type="link" onClick={() => {
                            this.addNode(item, item.type === 'modal' && item.modalType === 'detail' ? 'modalDetailItem' : componentData[item.type].allowChildrenType);
                        }} style={{ marginRight: 3 }}>
                            <Icon type="plus-circle"/>
                        </Button> : null
                    }
                    <Button type="link" onClick={() => {
                        this.deleteNode(pageData, index);
                    }}>
                        <Icon type="delete"/>
                    </Button>
                </div>
                {this.treeElement(item, level + 1)}
            </div>;
        }) : null;
    };

    readerPage = (pageData, level) => {
        const {
            form: { getFieldDecorator },
        } = this.props;

        if (!level) {
            level = 0;
        }
        return pageData.map(item => {
            if (item.type === 'search') {
                return <React.Fragment key={item.id}>
                    <div className="content">
                        <Form
                            className={['m5', item.labelWidth || 'formList80', item.children.length > 2 ? '' : 'shortSearch'].join(' ')}
                            layout="inline">
                            <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                                {this.readerPage(item.children, level + 1)}
                                {
                                    item.children && item.children.length !== 0 && item.children.length < 3 ?
                                        <Col md={8} sm={24}>
                                            <Button type="primary" htmlType="submit">
                                                <span className="iconfont icon-search mr8 fz14"></span>
                                                查询
                                            </Button>
                                            <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                                                <span className="iconfont icon-reset mr8 fz14"></span>
                                                重置
                                            </Button>
                                        </Col> : null
                                }
                            </Row>
                            {
                                item.children && item.children.length === 3 ?
                                    <div style={{ overflow: 'hidden' }}>
                                        <div className="fr">
                                            <Button type="primary" htmlType="submit">
                                                <span className="iconfont icon-search mr8 fz14"></span>
                                                查询
                                            </Button>
                                            <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                                                <span className="iconfont icon-reset mr8 fz14"></span>
                                                重置
                                            </Button>
                                        </div>
                                    </div> : null
                            }
                            {
                                item.children && item.children.length > 3 ?
                                    <div style={{ overflow: 'hidden' }}>
                                        <div className="fr">
                                            <Button type="primary" htmlType="submit">
                                                <span className="iconfont icon-search mr8 fz14"></span>
                                                查询
                                            </Button>
                                            <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                                                <span className="iconfont icon-reset mr8 fz14"></span>
                                                重置
                                            </Button>
                                            <a className="ml32 fz14" onClick={this.toggleForm}>
                                                收起 <Icon type="up"/>
                                            </a>
                                        </div>
                                    </div> : null
                            }
                        </Form>
                    </div>
                </React.Fragment>;
            }
            if (item.type === 'formItem') {
                const tmpVal = [];
                if (item.validation) {
                    item.validation.forEach(validationItem => {
                        tmpVal.push({ validator: validation[validationItem] });
                    });
                }
                if (item.formItemType === 'Select') {
                    return <React.Fragment key={item.id}>
                        <Col md={8} sm={24}>
                            <FormItem label={item.title || '标签'}>
                                {
                                    getFieldDecorator(item.fieldName || item.id,
                                        {
                                            rules: tmpVal,
                                        },
                                    )(
                                        <Select allowClear>
                                            {
                                                item.selectOptionData && item.selectOptionData.map(option => {
                                                    return <Option key={option.value} value={option.value}>{option.name}</Option>;
                                                })
                                            }
                                        </Select>,
                                    )
                                }
                            </FormItem>
                        </Col>
                    </React.Fragment>;
                }
                if (item.formItemType === 'TreeSelect') {
                    return <React.Fragment key={item.id}>
                        <Col md={8} sm={24}>
                            <FormItem label={item.title || '标签'}>
                                {
                                    getFieldDecorator(item.fieldName || item.id,
                                        {
                                            rules: tmpVal,
                                        },
                                    )(
                                        <TreeSelect treeData={item.selectOptionData} allowClear />,
                                    )
                                }
                            </FormItem>
                        </Col>
                    </React.Fragment>;
                }
                let attr = null;
                if (item.formItemType === 'TimePicker') {
                    attr = {
                        allowClear: true,
                        format: 'HH:mm',
                    };
                } else if (item.formItemType.split('-')[0] === 'DatePicker' && item.formItemType.split('-')[1] === 'showTime') {
                    attr = {
                        allowClear: true,
                        showTime: true,
                    };
                } else {
                    attr = {
                        allowClear: true,
                    };
                }
                return <React.Fragment key={item.id}>
                    <Col md={8} sm={24}>
                        <FormItem label={item.title || '标签'}>
                            {
                                getFieldDecorator(item.fieldName || item.id,
                                    {
                                        rules: tmpVal,
                                    },
                                )(
                                    React.createElement(allComponent[item.formItemType.split('-')[0]] || allComponent.Input, { ...attr }),
                                )
                            }
                        </FormItem>
                    </Col>
                </React.Fragment>;
            }
            if (item.type === 'table') {
                item.children.forEach(item1 => {
                    item1.width = Number(item1.width || 0);
                    item1.title = item1.title || '名称';
                });
                return <React.Fragment key={item.id}>
                    <div className="content mt20">
                        <div className="mb20 clearfix">
                            <span className="table-title">{item.title || '名称'}</span>
                            <div className="fr">
                                {
                                    // eslint-disable-next-line array-callback-return,consistent-return
                                    item.tableBtn && item.tableBtn.map(btn => {
                                        if (btn === 'add') {
                                            return <Button type="primary" className="ml8" key={btn}
                                                onClick={this.changeAddModal}>
                                                <span className="iconfont icon-add mr8 fz14"></span>新增
                                            </Button>;
                                        }
                                        if (btn === 'export') {
                                            return <Button type="primary" className="ml8" key={btn}
                                                onClick={this.exportFile}>
                                                <span className="iconfont icon-export mr8 fz14"></span>导出
                                            </Button>;
                                        }
                                        if (btn === 'import') {
                                            return <Button type="primary" className="ml8" key={btn}
                                                onClick={this.importFile}>
                                                <span className="iconfont icon-import mr8 fz14"></span>导入
                                            </Button>;
                                        }
                                    })
                                }
                            </div>
                        </div>
                        <Table
                            rowKey={(record) => {
                                return record.id;
                            }}
                            scroll="none"
                            columns={item.children}
                            dataSource={[]}
                            onChange={this.tableChange}></Table>
                    </div>
                </React.Fragment>;
            }
            if (item.type === 'modal') {
                return <Modal
                    key={item.id} title={item.title || '名称'} width={Number(item.modalWidth) || 800}
                    maskStyle={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} visible={item.modalShow === 'true'}
                    getContainer={() => { return document.querySelector('#mainContainer'); }}
                    okText="确定" cancelText="取消">
                    <Form
                        className={['m5', item.labelWidth || 'formList80', item.children.length > 2 ? '' : 'shortSearch', item.modalType === 'detail' ? 'detailList' : ''].join(' ')}
                        layout="inline">
                        <Row type="flex" gutter={{ md: 8, lg: 12, xl: 12 }}>
                            {this.readerPage(item.children, level + 1)}
                        </Row>
                    </Form>
                </Modal>;
            }
            if (item.type === 'modalFormItem') {
                const tmpVal = [];
                if (item.validation) {
                    item.validation.forEach(validationItem => {
                        tmpVal.push({ validator: validation[validationItem] });
                    });
                }
                if (item.formItemType === 'Select') {
                    return <React.Fragment key={item.id}>
                        <Col md={12} sm={24}>
                            <FormItem label={item.title || '标签'}>
                                {
                                    getFieldDecorator(item.fieldName || item.id,
                                        {
                                            rules: tmpVal,
                                        },
                                    )(
                                        <HxSelect allowClear>
                                            {
                                                item.selectOptionData && item.selectOptionData.map(option => {
                                                    return <Option key={option.value} value={option.value}>{option.name}</Option>;
                                                })
                                            }
                                        </HxSelect>,
                                    )
                                }
                            </FormItem>
                        </Col>
                    </React.Fragment>;
                }
                if (item.formItemType === 'TreeSelect') {
                    return <React.Fragment key={item.id}>
                        <Col md={12} sm={24}>
                            <FormItem label={item.title || '标签'}>
                                {
                                    getFieldDecorator(item.fieldName || item.id,
                                        {
                                            rules: tmpVal,
                                        },
                                    )(
                                        <HxTreeSelect treeData={item.selectOptionData} allowClear />,
                                    )
                                }
                            </FormItem>
                        </Col>
                    </React.Fragment>;
                }
                if (item.formItemType && (item.formItemType === 'TimePicker' || item.formItemType === 'MonthPicker' || item.formItemType.split('-')[0] === 'RangePicker' || item.formItemType === 'WeekPicker' || item.formItemType.split('-')[0] === 'DatePicker')) {
                    let attr = null;
                    if (item.formItemType === 'TimePicker') {
                        attr = {
                            allowClear: true,
                            format: 'HH:mm',
                        };
                    } else if ((item.formItemType.split('-')[0] === 'DatePicker' || item.formItemType.split('-')[0] === 'RangePicker') && item.formItemType.split('-')[1] === 'showTime') {
                        attr = {
                            allowClear: true,
                            showTime: true,
                        };
                    } else {
                        attr = {
                            allowClear: true,
                        };
                    }
                    return <React.Fragment key={item.id}>
                        <Col md={12} sm={24}>
                            <FormItem label={item.title || '标签'}>
                                {
                                    getFieldDecorator(item.fieldName || item.id,
                                        {
                                            rules: tmpVal,
                                        },
                                    )(
                                        React.createElement(allComponent[`Hx${item.formItemType.split('-')[0]}`], { ...attr }),
                                    )
                                }
                            </FormItem>
                        </Col>
                    </React.Fragment>;
                }

                return <React.Fragment key={item.id}>
                    <Col md={12} sm={24}>
                        <FormItem label={item.title || '标签'}>
                            {
                                getFieldDecorator(item.fieldName || item.id,
                                    {
                                        rules: tmpVal,
                                    },
                                )(
                                    React.createElement(allComponent[item.formItemType && item.formItemType.split('-')[0]] || allComponent.Input, { allowClear: true }),
                                )
                            }
                        </FormItem>
                    </Col>
                </React.Fragment>;
            }
            if (item.type === 'modalDetailItem') {
                return <Col md={12} sm={24}>
                    <FormItem label={item.title || '标签'}>
                        <div style={{ lineHeight: 1.5, display: 'inline-block', marginTop: 5 }}>
                            {item.fieldName}
                        </div>
                    </FormItem>
                </Col>;
            }
        });
    };

    routerSelect = (value) => {
        this.setState({
            routerPath: value[value.length - 1],
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <ConfigProvider locale={language['zh-CN']}>
                <Layout className={styles.layout}>
                    <Header className={styles.layoutHeader}>
                        <div className={styles.headerContainer}>
                            <img src={logo} alt=""/>
                            <Button type="primary" className={styles.generate} onClick={this.generate}>生成</Button>
                        </div>
                    </Header>
                    <Layout>
                        <Sider className={styles.layoutSiderBar} theme="light" width={240} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}>
                            <Button type="link" onClick={() => {
                                this.addNode(page, 'search');
                            }}>新增搜索</Button>
                            <Button className="ml10" type="link" onClick={() => {
                                this.addNode(page, 'table');
                            }}>新增表格</Button>
                            <Button className="ml10" type="link" onClick={() => {
                                this.addNode(page, 'modal');
                            }}>新增弹窗</Button>
                            {
                                this.treeElement(page)
                            }
                        </Sider>
                        <Layout style={{ position: 'relative' }} id="mainContainer">
                            <Content className={styles.layoutContent}>
                                <Breadcrumb className={styles.breadcrumb}>
                                    <Breadcrumb.Item>
                                        <span>示例</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <span>自动生成</span>
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                {
                                    this.readerPage(page.children)
                                }
                            </Content>
                            <Footer className={styles.layoutFooter}>
                                <div>&copy;2020 西安华信智慧数字科技有限公司</div>
                            </Footer>
                        </Layout>
                        <Sider className={styles.layoutSiderBar} theme="light" width={300}>
                            <h4>属性配置：</h4>
                            <Form
                                className="m5 formList80" layout="inline" onSubmit={this.handleFormSearch}
                                labelAlign="left">
                                <Row type="flex" gutter={{ md: 8, lg: 12, xl: 12 }}>
                                    {
                                    // eslint-disable-next-line array-callback-return,consistent-return
                                        selectNode ? componentData[selectNode.type].attr.map((item) => {
                                            if (item.type === 'input') {
                                                return <Col key={item.id} md={24} sm={24}>
                                                    <FormItem label={item.label}>
                                                        <Input defaultValue={selectNode[item.key]} onChange={(e) => {
                                                            this.updateData(item.key, e.target.value);
                                                        }} placeholder={`请输入${item.label}`}/>
                                                    </FormItem>
                                                </Col>;
                                            }
                                            if (item.type === 'select') {
                                            // const tempSelectNode = selectNode[item.key] || [];
                                                return <Col key={item.id} md={24} sm={24}>
                                                    <FormItem label={item.label}>
                                                        <Select
                                                            mode={item.multiple ? 'multiple' : ''} style={{ width: '100%' }}
                                                            defaultValue={item.multiple && selectNode[item.key] ? selectNode[item.key] : selectNode[item.key] || []}
                                                            onChange={(labeledValue) => {
                                                                this.updateData(item.key, labeledValue);
                                                            }} placeholder={`请选择${item.label}`}>
                                                            {
                                                                optionData[item.key] && optionData[item.key]?.length > 0 ? optionData[item.key].map((itemOption) => {
                                                                    return <Option
                                                                        key={uuidv4()}
                                                                        value={itemOption.value}>{itemOption.name}</Option>;
                                                                }) : null
                                                            }
                                                        </Select>
                                                    </FormItem>
                                                    {
                                                        (selectNode[item.key] === 'Select' || selectNode[item.key] === 'TreeSelect') && item.key === 'formItemType' ?
                                                            <div>
                                                                <ReactJson src={selectNode.selectOptionData || []} theme="monokai" onAdd={() => {}} onEdit={edit => { this.updateData('selectOptionData', edit.updated_src); this.setState({ areaJson: JSON.stringify(edit.updated_src) }); }} onDelete={() => {}} name={false} displayDataTypes={false} displayObjectSize={false} style={{ padding: '10px', borderRadius: '3px', margin: '10px 0px', lineHeight: '15px', fontSize: 12 }} indentWidth={2}></ReactJson>
                                                                <TextArea rows={4} placeholder="[{name: '', value: ''}]" defaultValue={JSON.stringify(selectNode.selectOptionData)} value={this.state.areaJson} onChange={(e) => {
                                                                    try {
                                                                        this.setState({ areaJson: e.target.value });
                                                                        // eslint-disable-next-line no-eval
                                                                        const tempJson = eval(e.target.value);
                                                                        this.updateData('selectOptionData', tempJson);
                                                                    } catch (err) {
                                                                        console.log(err);
                                                                    }
                                                                }} />
                                                            </div>
                                                            : null
                                                    }
                                                    {
                                                    selectNode[item.key]?.includes('export') && item.key === 'tableBtn' ?
                                                        <FormItem label="导出url">
                                                            <Input defaultValue={selectNode.exportUrl || ''}
                                                                onChange={(e) => {
                                                                    this.updateData('exportUrl', e.target.value);
                                                                }} placeholder="请输入"/>
                                                        </FormItem> : null
                                                    }
                                                    {
                                                    selectNode[item.key]?.includes('export') && item.key === 'tableBtn' ?
                                                        <FormItem label="导出文件名">
                                                            <Input defaultValue={selectNode.exportFileName || ''}
                                                                onChange={(e) => {
                                                                    this.updateData('exportFileName', e.target.value);
                                                                }} placeholder="请输入"/>
                                                        </FormItem> : null
                                                    }
                                                    {
                                                    selectNode[item.key]?.includes('import') && item.key === 'tableBtn' ?
                                                        <FormItem label="导入url">
                                                            <Input defaultValue={selectNode.importUrl || ''}
                                                                onChange={(e) => {
                                                                    this.updateData('importUrl', e.target.value);
                                                                }} placeholder="请输入"/>
                                                        </FormItem> : null
                                                    }
                                                    {
                                                    selectNode[item.key]?.includes('delete') && item.key === 'tableOperation' ?
                                                        <FormItem label="删除url">
                                                            <Input defaultValue={selectNode.deleteUrl || ''}
                                                                onChange={(e) => {
                                                                    this.updateData('deleteUrl', e.target.value);
                                                                }} placeholder="请输入"/>
                                                        </FormItem> : null
                                                    }
                                                    {
                                                        selectNode[item.key] === 'addAndEdit' && item.key === 'modalType' ?
                                                            <React.Fragment>
                                                                <FormItem label="新增url">
                                                                    <Input defaultValue={selectNode.addUrl || ''}
                                                                        onChange={(e) => {
                                                                            this.updateData('addUrl', e.target.value);
                                                                        }} placeholder="请输入"/>
                                                                </FormItem>
                                                                <FormItem label="详情url">
                                                                    <Input defaultValue={selectNode.editUrl || ''}
                                                                        onChange={(e) => {
                                                                            this.updateData('detailUrl', e.target.value);
                                                                        }} placeholder="请输入"/>
                                                                </FormItem>
                                                                <FormItem label="编辑url">
                                                                    <Input defaultValue={selectNode.editUrl || ''}
                                                                        onChange={(e) => {
                                                                            this.updateData('editUrl', e.target.value);
                                                                        }} placeholder="请输入"/>
                                                                </FormItem>
                                                            </React.Fragment> : null
                                                    }
                                                    {
                                                        selectNode[item.key] === 'detail' && item.key === 'modalType' ?
                                                            <React.Fragment>
                                                                <FormItem label="详情url">
                                                                    <Input defaultValue={selectNode.editUrl || ''}
                                                                        onChange={(e) => {
                                                                            this.updateData('detailUrl', e.target.value);
                                                                        }} placeholder="请输入"/>
                                                                </FormItem>
                                                            </React.Fragment> : null
                                                    }
                                                </Col>;
                                            }
                                        }) : null
                                    }
                                </Row>
                            </Form>
                        </Sider>
                    </Layout>

                    <Modal title="生成页面" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                        okText="确认" cancelText="取消">
                        <div>
                            <Form className="m5 formList100" layout="inline">
                                <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col xs={24}>
                                        <FormItem label="页面名称：">
                                            {getFieldDecorator('generatorName',
                                            )(
                                                <Input placeholder="请输入"/>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={24}>
                                        <FormItem label="生成路径：">
                                            {getFieldDecorator('generatorPath',
                                                {
                                                    initialValue: '',
                                                },
                                            )(
                                                <HxSelect placeholder="请选择">
                                                    <Option key="null" value="">
                                                    /pages
                                                    </Option>
                                                    {
                                                        this.state.dirArr.map(item => {
                                                            return <Option key={item.value} value={item.value}>
                                                            /pages/{item.name}
                                                            </Option>;
                                                        })
                                                    }
                                                </HxSelect>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={24}>
                                        <FormItem label="页面路由：">
                                            {getFieldDecorator('generatorRouter',
                                            )(
                                                <HxCascader changeOnSelect onChange={this.routerSelect}
                                                    options={this.cycle(routerData)} placeholder="Please select"/>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={24}>
                                        <FormItem label="路由Path：">
                                            <div>
                                                {this.state.routerPath}
                                            </div>
                                        </FormItem>
                                    </Col>
                                    <Col xs={24}>
                                        <FormItem label="路由名称：">
                                            {getFieldDecorator('generatorRouterName',
                                            )(
                                                <Input placeholder="请输入"/>,
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Modal>
                </Layout>
            </ConfigProvider>
        );
    }
}

export default Generator;
