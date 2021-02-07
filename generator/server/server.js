const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

const app = express();
app.use(bodyParser.json());
const port = 3000;
const pageBasePath = path.resolve('./src/pages');
const serviceBasePath = path.resolve('./src/services');
const modelBasePath = path.resolve('./src/models');
const routerBasePath = path.resolve('./config');

app.post('/generator/getDirArr', (req, res) => {
    const responseData = [];
    try {
        fs.readdirSync(pageBasePath).filter((dir1) => {
            return dir1.indexOf('.') === -1 && fs.lstatSync(path.resolve(pageBasePath, dir1)).isDirectory();
        }).forEach((item, index) => {
            responseData.push({
                name: item,
                value: item,
            });
            fs.readdirSync(path.resolve(pageBasePath, item)).filter((dir2) => {
                return dir2.indexOf('.') === -1 && fs.lstatSync(path.resolve(pageBasePath, item)).isDirectory();
            }).forEach(itemIn => {
                if (!responseData[index].children) {
                    responseData[index].children = [];
                }

                responseData[index].children.push({
                    name: itemIn,
                    value: itemIn,
                });
            });
        });
        res.json({
            success: true,
            data: responseData,
            message: '好着呢',
        });
    } catch (e) {
        res.json({
            success: false,
            data: [],
            message: '未知异常,请联系周谢忠',
        });
    }
});

const cyclePage = (data, req) => {
    if (data && data.length > 0) {
        data.forEach(item => {
            if (item.type === 'search') {
                req.pageData.hasSearch = true;
                req.pageData.searchItem = item.children;
            }
            if (item.type === 'formItem') {
                if (!req.pageData.AntdImport) {
                    req.pageData.AntdImport = new Set();
                }
                if (!req.pageData.antdSelectOption) {
                    req.pageData.antdSelectOption = [];
                }
                if (item.validation && item.validation.length > 0) {
                    req.pageData.indexHasValidation = true;
                }
                if (item.formItemType.split('-')[0] === 'Select') {
                    req.pageData.hasSearchSelect = true;
                }
                if (item.formItemType.split('-')[0] === 'MonthPicker' ||
                    item.formItemType.split('-')[0] === 'RangePicker' ||
                    item.formItemType.split('-')[0] === 'WeekPicker') {
                    req.pageData.AntdImport.add('DatePicker');
                    if (!req.pageData.picker) {
                        req.pageData.picker = [];
                    }
                    if (!req.pageData.picker.includes(item.formItemType.split('-')[0])) {
                        req.pageData.picker.push(item.formItemType.split('-')[0]);
                    }
                } else {
                    req.pageData.AntdImport.add(item.formItemType.split('-')[0]);
                }
                if (item.formItemType.split('-')[0] === 'Select' ||
                    item.formItemType.split('-')[0] === 'TreeSelect') {
                    req.pageData.antdSelectOption.push(item);
                }
            }
            if (item.type === 'modalFormItem') {
                if (!req.pageData.editModalImportHx) {
                    req.pageData.editModalImportHx = new Set();
                }
                if (!req.pageData.editModalImport) {
                    req.pageData.editModalImport = new Set();
                }
                if (!req.pageData.editModalTreeData) {
                    req.pageData.editModalTreeData = [];
                }
                if (item.formItemType.split('-')[0] === 'Select') {
                    req.pageData.hasModalSelect = true;
                }
                if (item.formItemType.split('-')[0] === 'TreeSelect' ||
                    item.formItemType.split('-')[0] === 'Select') {
                    req.pageData.editModalTreeData.push({
                        id: item.id.split('-')[0],
                        selectOptionData: item.selectOptionData,
                        fieldName: item.fieldName,
                    });
                }
                if (item.formItemType.split('-')[0] === 'MonthPicker' ||
                    item.formItemType.split('-')[0] === 'RangePicker' ||
                    item.formItemType.split('-')[0] === 'WeekPicker' ||
                    item.formItemType.split('-')[0] === 'DatePicker' ||
                    item.formItemType.split('-')[0] === 'TreeSelect' ||
                    item.formItemType.split('-')[0] === 'TimePicker' ||
                    item.formItemType.split('-')[0] === 'Select') {
                    req.pageData.editModalImportHx.add(`Hx${item.formItemType.split('-')[0]}`);
                } else {
                    req.pageData.editModalImport.add(item.formItemType.split('-')[0]);
                }
            }
            if (item.type === 'table') {
                req.pageData.hasTable = true;
                req.pageData.tableTitle = item.title;
                req.pageData.tableOperation = item.tableOperation;
                req.pageData.tableBtn = item.tableBtn;

                req.pageData.tableExportUrl = item.exportUrl;
                req.pageData.tableExportFileName = item.exportFileName;
                req.pageData.tableImportUrl = item.importUrl;
                req.pageData.tableDeleteUrl = item.deleteUrl;

                req.pageData.searchUrl = item.apiUrl;
                req.pageData.tableColumn = JSON.parse(JSON.stringify(item.children));
                req.pageData.tableColumn.forEach(tableColumnItem => {
                    delete tableColumnItem.id;
                    delete tableColumnItem.type;
                    if (tableColumnItem.width === 0) {
                        delete tableColumnItem.width;
                    }
                    if (!tableColumnItem.align) {
                        delete tableColumnItem.align;
                    }
                    if (!tableColumnItem.fixed) {
                        delete tableColumnItem.fixed;
                    }
                });
            }
            if (item.type === 'modal') {
                if (!req.pageData.modal) {
                    req.pageData.modal = [];
                }
                if (item.modalType === 'addAndEdit') {
                    req.pageData.modalEditUrl = item.editUrl || '';
                    req.pageData.modalDetailUrl = item.detailUrl || '';
                    req.pageData.modalAddUrl = item.addUrl || '';
                }

                if (item.editUrl) {
                    req.pageData.modalHasEdit = true;
                }
                if (item.addUrl) {
                    req.pageData.modalHasAdd = true;
                }
                if (item.detailUrl) {
                    req.pageData.modalHasDetail = true;
                }
                req.pageData.modal.push(item);
            }
            cyclePage(item.children, req);
        });
    }
};

app.post('/generator/create', (req, res) => {
    req.pageData = {};

    const reqData = req.body;
    // if (!reqData.path) {
    //     reqData.path = '';
    // }
    const pagePath = path.resolve(pageBasePath, reqData.path, reqData.name);
    if (fs.existsSync(pagePath)) {
        res.json({
            success: false,
            message: '目录已存在,请尝试其他名称',
        });
        return;
    }
    fs.mkdirSync(pagePath);

    cyclePage(reqData.page.children, req);

    const page = `import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Form, Row, Col${req.pageData.hasSearch ? `, ${Array.from(req.pageData.AntdImport).join(', ')}` : ''}${req.pageData.tableBtn && req.pageData.tableBtn.includes('import') ? ', Upload' : ''}${req.pageData.tableBtn && req.pageData.tableBtn.includes('import') ? ', message' : ''}${req.pageData.tableOperation && req.pageData.tableOperation.length > 1 ? ', Divider' : ''}${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? ', Modal' : ''} } from 'antd';
import { connect } from 'dva';${req.pageData.tableBtn && req.pageData.tableBtn.includes('export') ? `
import Export from '@/utils/export';
` : ''}${req.pageData.modal && req.pageData.modal.length > 0 ?
    req.pageData.modal.map(item => {
        if (item.modalType === 'addAndEdit') {
            return `
import EditModal from './components/EditModal';`;
        }
        if (item.modalType === 'detail') {
            return `
import DetailModal from './components/DetailInfoModal';`;
        }
    }).join('') : ''}${req.pageData.indexHasValidation ? `
import validate from '@/utils/validation';` : ''}

const FormItem = Form.Item;${req.pageData.antdSelectOption && req.pageData.antdSelectOption.length > 0 ? req.pageData.antdSelectOption.map(selectOptionItem => {
        return `
const treeData${selectOptionItem.fieldName ? selectOptionItem.fieldName.replace(selectOptionItem.fieldName[0], selectOptionItem.fieldName[0].toUpperCase()) : selectOptionItem.id} = ${JSON.stringify(selectOptionItem.selectOptionData)};`;
    }).join('') : ''}
${req.pageData.picker ? `
const { ${req.pageData.picker.map(pickerTypeItem => {
        return pickerTypeItem;
    }).join(', ')} } = DatePicker;` : ''}${req.pageData.hasSearchSelect ? `
const { Option } = Select;` : ''}${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? `
const { ${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? 'confirm' : ''} } = Modal;` : ''}

@connect(({ loading, ${reqData.name}Space }) => {
    return {
        ${reqData.name}Space,
        loadingSearch: loading.effects['${reqData.name}Space/getList'],
    };
})
@Form.create()
class ${reqData.name}View extends Component {
    columns = [\n        ${req.pageData.tableColumn && req.pageData.tableColumn.map(item => {
        let str = '';
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in item) {
            // eslint-disable-next-line no-return-assign
            str += `\n            ${i}: ${item[i] === null ? null : `${i !== 'width' ? '\'' : ''}${item[i]}${i !== 'width' ? '\'' : ''}`},`;
        }
        return `{${str}\n        },`;
    }).join('\n        ')}${req.pageData.tableOperation && req.pageData.tableOperation.length > 0 ? `
        {
            title: '操作',
            dataIndex: 'tableOperation',
            fixed: 'right',
            width: ${req.pageData.tableOperation.length * 50 + 30},
            render: (text, record) => {
                return (
                    <div>
                        ${req.pageData.tableOperation && req.pageData.tableOperation.map(item => {
        if (item === 'edit') {
            return `<Button
                            type="link"
                            onClick={() => {
                                return this.showEditModal(record);
                            }}>
                            编辑
                        </Button>`;
        }
        if (item === 'delete') {
            return `<Button
                            className="link-delete"
                            type="link"
                            onClick={() => {
                                return this.showConfirm(record);
                            }}>
                            删除
                        </Button>`;
        }
        if (item === 'detail') {
            return `<Button
                            type="link"
                            onClick={() => {
                                return this.showDetailModal(record);
                            }}>
                            详情
                        </Button>`;
        }
    }).join('\n                        <Divider type="vertical"></Divider>\n                        ')}
                    </div>
                );
            },
            align: 'center',
        }` : ''},\n    ]

    constructor(props) {
        super(props);
        this.state = {${req.pageData.searchItem && req.pageData.searchItem.length > 3 ? `
            expand: false,` : ''}${req.pageData.modal && req.pageData.modal.length > 0 ?
    req.pageData.modal.map(item => {
        if (item.modalType === 'addAndEdit') {
            return `
            editModalVisible: false,`;
        }
        if (item.modalType === 'detail') {
            return `
            detailModalVisible: false,`;
        }
    }).join('') : ''}${req.pageData.modalHasEdit || req.pageData.modalHasDetail ? `
            id: '',` : ''}
        };
    }

    componentDidMount = () => {
        this.getList(0);
    };

    getList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const searchData = this.props.form.getFieldsValue();
        dispatch({
            type: '${reqData.name}Space/getList',
            payload: {
                page,
                size,
                ...searchData,
            },
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        return this.getList(pagination.current - 1, pagination.pageSize);
    };

    // 查询数据
    handleSearch = () => {
        this.getList(0);
    };

    // 重置查询条件
    resetSearch = () => {
        this.props.form.resetFields();
    };${req.pageData.searchItem && req.pageData.searchItem.length > 3 ? `

    toggleForm = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }` : ''}${req.pageData.tableBtn ? req.pageData.tableBtn.map(btn => {
    if (btn === 'add') {
        return `

    showEditModal = (record) => {
        const { dispatch } = this.props;
        if (record && record.id) {
            dispatch({
                type: '${reqData.name}Space/getDetailInfo',
                payload: record.id,
            });
        }
        this.setState((preState) => {
            return {
                editModalVisible: !preState.editModalVisible,
                id: record && record.id ? record.id : '',
            };
        });
    };`;
    }
    if (btn === 'export') {
        return `

    export = () => {
        const uri = '${req.pageData.tableExportUrl || ''}';
        Export.exportAsset('${req.pageData.tableExportFileName || ''}', uri, 'post');
    };`;
    }
    if (btn === 'import') {
        return `

    getUploadProps = () => {
        const props = {
            name: 'file',
            action: '${req.pageData.tableImportUrl || ''}',
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers: {
                authorization: storage.getStorage('authorization'),
                clientId: storage.getStorage('clientId'),
            },
            onChange: (info) => {
                if (info.file.status === 'done') {
                    this.getList(0);
                    message.success(\`\${info.file.name} 上传成功！\`);
                } else if (info.file.status === 'error') {
                    message.error(\`\${info.file.name} 上传失败！\`);
                }
            },
        };
        return props;
    };
`;
    }
}).join('') : ''}${req.pageData.modal && req.pageData.modal.length > 0 ?
    req.pageData.modal.map(item => {
        if (item.modalType === 'addAndEdit') {
            return `

    cancelEditModal = () => {${item.editUrl ? `
        const { dispatch } = this.props;
        dispatch({
            type: '${reqData.name}Space/saveDetailInfo',
            payload: {},
        });` : ''}
        this.setState({
            editModalVisible: false,
        });
    }

    editComplete = () => {${item.editUrl ? `
        const { dispatch } = this.props;
        dispatch({
            type: '${reqData.name}Space/saveDetailInfo',
            payload: {},
        });` : ''}
        this.setState({
            editModalVisible: false,
        });
        this.getList();
    }`;
        }
        if (item.modalType === 'detail' && req.pageData.modal.length > 1) {
            return `

    cancelDetailModal = () => {${item.detailUrl ? `
        const { dispatch } = this.props;
        dispatch({
            type: '${reqData.name}Space/saveDetailInfo',
            payload: {},
        });` : ''}
        this.setState({
            detailModalVisible: false,
        });
    }`;
        }
    }).join('') : ''}${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? `

    showConfirm = record => {
        confirm({
            content: '删除后不可恢复，确定要删除此内容吗？',
            title: '确定要删除该内容？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return new Promise((resolve) => {
                    this.deleteItem(record.id, resolve);
                }).catch();
            },
        });
    };

    deleteItem = (id, resolve) => {
        const { dispatch } = this.props;
        dispatch({
            type: '${reqData.name}Space/deleteItem',
            payload: id,
            callback: () => {
                resolve();
                this.getList();
            },
        });
    }` : ''}${req.pageData.tableOperation && req.pageData.tableOperation.includes('detail') ? `

    showDetailModal = record => {
        const { dispatch } = this.props;
        if (record && record.id) {
            dispatch({
                type: '${reqData.name}Space/getDetailInfo',
                payload: record.id,
            });
        }
        this.setState({
            detailModalVisible: true,
            id: record.id,
        });
    };` : ''}

    render() {
        const {
            form: { getFieldDecorator },
            ${reqData.name}Space: { tableList },
        } = this.props;${req.pageData.modalHasEdit || req.pageData.modalHasDetail ? `
        const { id } = this.state;` : ''}
        const { data = [], pageable = {} } = tableList;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{pageable.totalPages}</a>页/<a>{pageable.totalElements}</a>条数据
                    </span>
                );
            },
            total: pageable.totalElements,
            pageSize: pageable.size,
            current: parseInt(pageable.number + 1, 10) || 1,
            showSizeChanger: true,
        };
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <Form className="m5 formList80" layout="inline">
                        <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>${req.pageData.searchItem && req.pageData.searchItem.map((item, index) => {
        return `
                            <Col md={8} sm={24} ${index > 2 ? 'style={{ display: this.state.expand ? \'block\' : \'none\' }}' : ''}>
                                <FormItem label="${item.title}">
                                    {getFieldDecorator('${item.fieldName}'${item.validation && item.validation.length > 0 ? `, {
                                        rules: [${item.validation.map(validationItem => {
        if (validationItem.includes('_require') || validationItem.includes('_length')) {
            return `
                                            validate.${validationItem}`;
        }
        return `
                                            {
                                                validator: validate.${validationItem},
                                            }`;
    })},
                                        ],
                                    }` : ''})(
                                        <${item.formItemType.split('-')[0]}${item.formItemType.split('-')[1] ? ` ${item.formItemType.split('-')[1]}` : ''}${item.formItemType.split('-')[0] === 'TreeSelect' ? ` treeData={ treeData${item.fieldName ? item.fieldName.replace(item.fieldName[0], item.fieldName[0].toUpperCase()) : item.id} }` : ''}${item.formItemType.split('-')[0] === 'Input' ? ' placeholder="请输入"' : ' placeholder="请选择"'} allowClear>${item.formItemType === 'Select' ? `
                                            {
                                                treeData${item.fieldName ? item.fieldName.replace(item.fieldName[0], item.fieldName[0].toUpperCase()) : item.id}.map(option => { return <Option key={option.value} value={option.value}>{option.name}</Option>; })
                                            }` : ''}
                                        </${item.formItemType.split('-')[0]}>,
                                    )}
                                </FormItem>
                            </Col>`;
    }).join('\n')}${req.pageData.searchItem && req.pageData.searchItem.length < 3 ? `<Col md={8} sm={24}>
                                            <Button type="primary" onClick={this.handleSearch}>
                                                <span className="iconfont icon-search mr8 fz14"></span>
                                                查询
                                            </Button>
                                            <Button className="ml8 bg-button-reset" onClick={this.resetSearch}>
                                                <span className="iconfont icon-reset mr8 fz14"></span>
                                                重置
                                            </Button>
                                        </Col>` : ''}
                        </Row>${req.pageData.searchItem && req.pageData.searchItem.length >= 3 ? `
                        <div style={{ overflow: 'hidden' }}>
                            <div className="fr">
                                <Button type="primary" onClick={this.handleSearch}>
                                    <span className="iconfont icon-search mr8 fz14"></span>
                                    查询
                                </Button>
                                <Button className="ml8 bg-button-reset" onClick={this.resetSearch}>
                                    <span className="iconfont icon-reset mr8 fz14"></span>
                                    重置
                                </Button>${req.pageData.searchItem && req.pageData.searchItem.length > 3 ? `
                                <a className="ml32 fz14" onClick={this.toggleForm}>
                                    更多条件 <Icon type={this.state.expand ? 'up' : 'down'} ></Icon>
                                </a>` : ''}
                            </div>
                        </div>` : ''}
                    </Form>
                </div>
                <div className="content mt20">
                    <div className="mb20 clearfix">
                        <span className="table-title">${req.pageData.tableTitle ? req.pageData.tableTitle : ''}</span>${req.pageData.tableBtn && req.pageData.tableBtn.length > 0 ? `
                        <div className="fr">${req.pageData.tableBtn && req.pageData.tableBtn.map(btn => {
        if (btn === 'add') {
            return `
                            <Button className="ml8" type="primary" onClick={this.showEditModal}>
                                <span className="iconfont icon-add mr8 fz14"></span>新增
                            </Button>`;
        }
        if (btn === 'export') {
            return `
                            <Button className="ml8" type="primary" onClick={this.exportFile}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>`;
        }
        if (btn === 'import') {
            return `
                            <Upload {...this.getUploadProps()} showUploadList={false}>
                                <Button className="ml8" type="primary">
                                    <span className="iconfont icon-import mr8 fz14"></span>导入
                                </Button>
                            </Upload>`;
        }
    }).join('')}
                        </div>` : ''}
                    </div>
                    <Table
                        rowKey="id"
                        loading={this.props.loadingSearch}
                        scroll={{ x: 1100 }}
                        columns={this.columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}></Table>
                </div>${req.pageData.modal && req.pageData.modal.length > 0 ?
        req.pageData.modal.map(item => {
            if (item.modalType === 'addAndEdit') {
                return `\n                <EditModal${req.pageData.modalHasEdit ? ' id={id}' : ''} cancelModal={this.cancelEditModal} editComplete={this.editComplete} visible={this.state.editModalVisible}></EditModal>`;
            }
            if (item.modalType === 'detail') {
                return `\n                <DetailModal${req.pageData.modalHasDetail ? ' id={id}' : ''} cancelModal={this.cancelDetailModal} visible={this.state.detailModalVisible}></DetailModal>`;
            }
        }).join(',') : ''}
            </div>
        );
    }
}

export default ${reqData.name}View;
`;

    fs.writeFileSync(`${pagePath}/index.jsx`, page);
    fs.writeFileSync(`${modelBasePath}/${reqData.name}Model.js`, `import { getList${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? ', deleteItem' : ''}${req.pageData.modalHasEdit ? ', getDetailInfo, updateDetailInfo' : ''}${req.pageData.modalHasAdd ? ', addDetailInfo' : ''} } from '../services/${reqData.name}Service';

export default {
    namespace: '${reqData.name}Space',
    state: {
        tableList: [],${req.pageData.modalHasEdit ? `
        detailInfo: {},` : ''}
    },

    effects: {
        *getList({ payload, callback }, { call, put }) {
            const response = yield call(getList, payload);
            if (response.status === 200) {
                yield put({
                    type: 'saveList',
                    payload: response,
                });
            }
            if (callback) { callback(); }
        },${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? `

        *deleteItem({ payload, callback }, { call }) {
            yield call(deleteItem, payload);
            if (callback) { callback(); }
        },` : ''}${req.pageData.modalHasEdit ? `

        *getDetailInfo({ payload, callback }, { call, put }) {
            const response = yield call(getDetailInfo, payload);
            if (response.status === 200) {
                yield put({
                    type: 'saveDetailInfo',
                    payload: response.data,
                });
            }
            if (callback) { callback(); }
        },

        *updateDetailInfo({ payload, callback }, { call }) {
            yield call(updateDetailInfo, payload);
            if (callback) { callback(); }
        },` : ''}${req.pageData.modalHasAdd ? `

        *addDetailInfo({ payload, callback }, { call }) {
            yield call(addDetailInfo, payload);
            if (callback) { callback(); }
        },` : ''}
    },

    reducers: {
        saveList(state, { payload }) {
            return {
                ...state,
                tableList: payload || [],
            };
        },${req.pageData.modalHasEdit ? `

        saveDetailInfo(state, { payload }) {
            return {
                ...state,
                detailInfo: payload || {},
            };
        },` : ''}
    },
};`);
    fs.writeFileSync(`${serviceBasePath}/${reqData.name}Service.js`, `import request from '@/utils/request';

export async function getList(params) {
    return request('${req.pageData.searchUrl || ''}', {
        method: 'POST',
        params: {
            ...params,
        },
    });
}${req.pageData.tableOperation && req.pageData.tableOperation.includes('delete') ? `

export async function deleteItem(id) {
    return request(\`${req.pageData.tableDeleteUrl || ''}\${id}\`, {
        method: 'DELETE',
    });
}` : ''}${req.pageData.modalHasEdit ? `

export async function getDetailInfo(id) {
    return request(\`${req.pageData.modalDetailUrl || ''}\${id}\`, {
        method: 'GET',
    });
}

export async function updateDetailInfo(params) {
    const { id, ...data } = params;
    return request(\`${req.pageData.modalEditUrl || ''}\${params.id}\`, {
        method: 'PUT',
        data,
    });
}` : ''}${req.pageData.modalHasAdd ? `

export async function addDetailInfo(params) {
    return request('${req.pageData.modalAddUrl}', {
        method: 'POST',
        data: params,
    });
}` : ''}`);

    if (req.pageData.modal && req.pageData.modal.length > 0) {
        req.pageData.modal.forEach(item => {
            if (item.modalType === 'addAndEdit') {
                const addAndEditModal = `import { Row, Col, Modal, Form${Array.from(req.pageData.editModalImport).length > 0 ? `, ${Array.from(req.pageData.editModalImport).map(editModalImportItem => {
                    return editModalImportItem;
                }).join(', ')}` : ''}${req.pageData.hasModalSelect ? ', Select' : ''} } from 'antd';
import React from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';${Array.from(req.pageData.editModalImportHx).length > 0 ? `
import { ${Array.from(req.pageData.editModalImportHx).map(editModalImportItem => {
        return editModalImportItem;
    }).join(', ')} } from '@/components/hx-components';` : ''}

const FormItem = Form.Item;${req.pageData.editModalTreeData && req.pageData.editModalTreeData.length > 0 ? req.pageData.editModalTreeData.map(treeDataItem => {
        return `
const treeData${treeDataItem.fieldName ? treeDataItem.fieldName.replace(treeDataItem.fieldName[0], treeDataItem.fieldName[0].toUpperCase()) : treeDataItem.id} = ${JSON.stringify(treeDataItem.selectOptionData)};`;
    }).join('') : ''}${req.pageData.hasModalSelect ? '\nconst { Option } = Select;' : ''}

@connect(({ ${item.editUrl || item.addUrl ? 'loading, ' : ''}${reqData.name}Space }) => {
    return {
        ${reqData.name}Space,${item.addUrl ? `
        loadingAdd: loading.effects['${reqData.name}Space/addDetailInfo'],` : ''}${item.editUrl ? `
        loadingEdit: loading.effects['${reqData.name}Space/updateDetailInfo'],` : ''}
    };
})
@Form.create()
class EditFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    handleEdit = () => {
        const { form, dispatch, editComplete, id } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }${item.editUrl && item.addUrl ? `
            if (id) {
                dispatch({
                    type: '${reqData.name}Space/updateDetailInfo',
                    payload: {
                        ...fieldsValue,
                        id,
                    },
                    callback: () => {
                        if (editComplete) {
                            editComplete();
                        }
                    },
                });
            } else {
                dispatch({
                    type: '${reqData.name}Space/addDetailInfo',
                    payload: {
                        ...fieldsValue,
                    },
                    callback: () => {
                        if (editComplete) {
                            editComplete();
                        }
                    },
                });
            }` : ''}${item.editUrl && !item.addUrl ? `
            dispatch({
                type: '${reqData.name}Space/updateDetailInfo',
                payload: {
                    ...fieldsValue,
                    id,
                },
                callback: () => {
                    if (editComplete) {
                        editComplete();
                    }
                },
            });` : ''}${!item.editUrl && item.addUrl ? `
            dispatch({
                type: '${reqData.name}Space/addDetailInfo',
                payload: {
                    ...fieldsValue,
                },
                callback: () => {
                    if (editComplete) {
                        editComplete();
                    }
                },
            });` : ''}
        });
    };

    cancelModal = () => {
        const { cancelModal } = this.props;
        if (cancelModal) {
            cancelModal();
        }
    };

    render() {
        const { form: { getFieldDecorator }, visible, id${item.editUrl || item.addUrl ? `, ${reqData.name}Space: { ${item.editUrl ? 'detailInfo' : ''} }` : ''}${item.addUrl ? ', loadingAdd' : ''}${item.editUrl ? ', loadingEdit' : ''} } = this.props;
        return (
            <div>
                <Modal
                    title={id ? '编辑' : '新增'}${item.editUrl || item.addUrl ? ' confirmLoading={id ? loadingEdit : loadingAdd}' : ''} destroyOnClose visible={visible}
                    maskClosable={false} onOk={this.handleEdit} onCancel={this.cancelModal} width={Number(${item.modalWidth})}>
                    <Form className="${item.labelWidth}">
                        <Row type="flex" gutter={{ md: 8, lg: 12 }}>${item.children && item.children.length > 0 ? item.children.map(modalFormItem => {
        return `
                            <Col xs={24} md={12}>
                                <FormItem label="${modalFormItem.title}">
                                    {getFieldDecorator('${modalFormItem.fieldName}',${modalFormItem.validation && modalFormItem.validation.length > 0 ? ` {
                                        rules: [${modalFormItem.validation.map(validationItem => {
        if (validationItem.includes('_require') || validationItem.includes('_length')) {
            return `
                                            validate.${validationItem}`;
        }
        return `
                                            {
                                                validator: validate.${validationItem},
                                            }`;
    })},
                                        ],${item.editUrl ? `
                                        initialValue: detailInfo.${modalFormItem.fieldName},` : ''}
                                    },` : ''}
                                    )(
                                        <${modalFormItem.formItemType.split('-')[0] === 'MonthPicker' || modalFormItem.formItemType.split('-')[0] === 'RangePicker' || modalFormItem.formItemType.split('-')[0] === 'WeekPicker' || modalFormItem.formItemType.split('-')[0] === 'DatePicker' || modalFormItem.formItemType.split('-')[0] === 'TreeSelect' || modalFormItem.formItemType.split('-')[0] === 'Select' || modalFormItem.formItemType.split('-')[0] === 'TimePicker' ? `Hx${modalFormItem.formItemType.split('-')[0]}` : `${modalFormItem.formItemType.split('-')[0]}`} allowClear${modalFormItem.formItemType.split('-')[1] ? ` ${modalFormItem.formItemType.split('-')[1]}` : ''}${modalFormItem.formItemType.split('-')[0] === 'TreeSelect' ? ` treeData={ treeData${modalFormItem.fieldName ? modalFormItem.fieldName.replace(modalFormItem.fieldName[0], modalFormItem.fieldName[0].toUpperCase()) : modalFormItem.id.split('-')[0]} }` : ''}${modalFormItem.formItemType.split('-')[0] === 'Input' ? ' placeholder="请输入"' : ' placeholder="请选择"'}>${modalFormItem.formItemType === 'Select' ? `
                                            {
                                                treeData${modalFormItem.fieldName ? modalFormItem.fieldName.replace(modalFormItem.fieldName[0], modalFormItem.fieldName[0].toUpperCase()) : modalFormItem.id.split('-')[0]}.map(option => { return <Option key={option.value} value={option.value}>{option.name}</Option>; })
                                            }` : ''}
                                        </${modalFormItem.formItemType.split('-')[0] === 'MonthPicker' || modalFormItem.formItemType.split('-')[0] === 'RangePicker' || modalFormItem.formItemType.split('-')[0] === 'WeekPicker' || modalFormItem.formItemType.split('-')[0] === 'DatePicker' || modalFormItem.formItemType.split('-')[0] === 'TreeSelect' || modalFormItem.formItemType.split('-')[0] === 'Select' || modalFormItem.formItemType.split('-')[0] === 'TimePicker' ? `Hx${modalFormItem.formItemType.split('-')[0]}` : `${modalFormItem.formItemType.split('-')[0]}`}>,
                                    )}
                                </FormItem>
                            </Col>`;
    }).join('') : ''}
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default EditFormModal;`;
                const componentPath = path.resolve(pageBasePath, reqData.path, reqData.name, 'components');
                if (!fs.existsSync(componentPath)) {
                    fs.mkdirSync(componentPath);
                }
                fs.writeFileSync(path.resolve(componentPath, 'EditModal.jsx'), addAndEditModal);
            }
            if (item.modalType === 'detail') {
                const DetailInfoModal = `import { Row, Col, Modal, Form, Button } from 'antd';
import React from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ ${reqData.name}Space }) => {
    return {
        ${reqData.name}Space,
    };
})
@Form.create()
class DetailInfoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    cancelModal = () => {
        const { cancelModal } = this.props;
        if (cancelModal) {
            cancelModal();
        }
    }

    render() {
        const { visible, ${reqData.name}Space: { detailInfo } } = this.props;
        return (
            <div>
                <Modal
                    title="详情" destroyOnClose visible={visible} onCancel={this.cancelModal} footer={[
                        <Button key="cancelKey" type="primary" onClick={this.cancelModal}>确定</Button>,
                    ]}
                    maskClosable={false} width={Number(${item.modalWidth})}>
                    <Form className="${item.labelWidth}">
                        <Row type="flex" gutter={{ md: 8, lg: 12 }}>${item.children && item.children.length > 0 ? item.children.map(modalFormItem => {
        return `
                            <Col md={12} sm={24}>
                                <FormItem label="${modalFormItem.title}">
                                    <div style={{ lineHeight: 1.5, display: 'inline-block', marginTop: 5 }}>
                                        {detailInfo.${modalFormItem.fieldName}}
                                    </div>
                                </FormItem>
                            </Col>`;
    }).join('') : ''}
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default DetailInfoModal;`;
                const componentPath = path.resolve(pageBasePath, reqData.path, reqData.name, 'components');
                if (!fs.existsSync(componentPath)) {
                    fs.mkdirSync(componentPath);
                }
                fs.writeFileSync(path.resolve(componentPath, 'DetailInfoModal.jsx'), DetailInfoModal);
            }
            if (item.modalType === 'other') {

            }
        });
    }


    fs.readdirSync(routerBasePath).filter((routerDir) => {
        return routerDir.includes('router') || routerDir.includes('Router');
    }).forEach((item, index) => {
        const fileData = fs.readFileSync(path.resolve(routerBasePath, item), 'utf8');
        if (fileData.includes(`path: '${reqData.router}'`)) {
            // console.log('匹配到了', item);
            // console.log('fileData', fileData);
            const ast = esprima.parseModule(fileData);
            // console.log('ast', ast);
            estraverse.traverse(ast, {
                enter(node, parent) {
                    // console.log('enter', node.type);
                    if (node.type === 'ObjectExpression' && node.properties && node.properties.length > 0 && node.properties[0].type === 'Property' && node.properties[0].value.type === 'Literal' && node.properties[0].value.value === reqData.router) {
                        // console.log(JSON.stringify(node.properties[2].value.elements[0]));
                        // eslint-disable-next-line no-shadow
                        node.properties.forEach(item => {
                            if (item.key.type === 'Identifier' && item.key.name === 'routes') {
                                item.value.elements.push({
                                    type: 'ObjectExpression',
                                    properties: [
                                        {
                                            type: 'Property',
                                            key: {
                                                type: 'Identifier',
                                                name: 'path',
                                            },
                                            computed: false,
                                            value: {
                                                type: 'Literal',
                                                value: `${reqData.router ? `${reqData.router}` : ''}/${reqData.name}`,
                                                raw: `'${reqData.router ? `${reqData.router}` : ''}/${reqData.name}'`,
                                            },
                                            kind: 'init',
                                            method: false,
                                            shorthand: false,
                                        },
                                        {
                                            type: 'Property',
                                            key: {
                                                type: 'Identifier',
                                                name: 'name',
                                            },
                                            computed: false,
                                            value: {
                                                type: 'Literal',
                                                value: `${reqData.routerName}`,
                                                raw: `'${reqData.routerName}'`,
                                            },
                                            kind: 'init',
                                            method: false,
                                            shorthand: false,
                                        },
                                        {
                                            type: 'Property',
                                            key: {
                                                type: 'Identifier',
                                                name: 'component',
                                            },
                                            computed: false,
                                            value: {
                                                type: 'Literal',
                                                value: `../../src/pages${reqData.path ? `/${reqData.path}` : ''}/${reqData.name}/index`,
                                                raw: `'../../src/pages${reqData.path ? `/${reqData.path}` : ''}/${reqData.name}/index'`,
                                            },
                                            kind: 'init',
                                            method: false,
                                            shorthand: false,
                                        },
                                    ],
                                });
                            }
                        });
                    }
                },
                leave(node) {
                    // console.log(node);
                    // console.log('leave', node.type);
                    // if (node.type == 'Identifier') {
                    //     node.name += '_leave';
                    // }
                },
            });

            const result = escodegen.generate(ast, {
                comment: true,
            });

            fs.writeFileSync(path.resolve(routerBasePath, item), result);
        }
    });

    res.json({
        success: true,
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}!`);
});
