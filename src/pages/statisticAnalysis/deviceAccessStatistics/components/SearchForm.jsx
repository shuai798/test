import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Cascader } from 'antd';

const FormItem = Form.Item;

@connect(({ inspectionStandard }) => {
    return {
        inspectionStandard,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            locationData: [],
        };
    }

    componentDidMount() {
        this.getTreeData();
        this.getLocationData();
    }

    getTreeData = () => {
        const { dispatch } = this.props;
        const { orgId } = JSON.parse(localStorage.getItem('userInfo'));
        dispatch({
            type: 'organizationChartSpace/getTableListInfo',
            payload: {
                orgId,
            },
            callback: (res) => {
                const list = res || [];
                this.changeDataToTreeSelect(list);
                this.setState({
                    treeData: list,
                });
            },
        });
    };

    changeDataToTreeSelect = (dataList) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].key = list[i].id;
                list[i].label = list[i].name;
                list[i].value = list[i].id;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    changeCityData = (dataList) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].key = list[i].code;
                list[i].label = list[i].name;
                list[i].value = list[i].code;
                if (list[i].childrenList && list[i].childrenList.length > 0) {
                    list[i].children = this.changeCityData(list[i].childrenList, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    // 获取地理位置
    getLocationData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pendingEventSpace/getLocationData',
            callback: (res) => {
                const list = res.data || [];
                this.changeCityData(list);
                this.setState({
                    locationData: list,
                });
            },
        });
    };

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, value) => {
            if (err) {
                return;
            }
            let values = {};
            if (value.areaCode && value.areaCode.length > 1) {
                value.areaCode = value.areaCode[value.areaCode.length - 1];
            }
            if (value.organizationId && value.organizationId.length > 1) {
                value.organizationId = value.organizationId[value.organizationId.length - 1];
            }
            values = {
                ...value,
            };
            const params = {
                ...values,
            };
            this.props.handleSearch(params);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.reset();
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { treeData, locationData } = this.state;
        return (
            <div className="formList80 shortSearch">
                <Form layout="inline" onSubmit={this.handleFormSearch}>
                    <Row type="flex" gutter={20}>
                        <Col span={8}>
                            <FormItem label="所属组织">{getFieldDecorator('organizationId')(<Cascader options={treeData} changeOnSelect />)}</FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="地理位置">{getFieldDecorator('areaCode', {})(<Cascader options={locationData} changeOnSelect />)}</FormItem>
                        </Col>
                        <Col span={8}>
                            <Button type="primary" htmlType="submit">
                                <span className="iconfont icon-search mr8 fz14"></span>
                                查询
                            </Button>
                            <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                                <span className="iconfont icon-reset mr8 fz14"></span>
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Curd;
