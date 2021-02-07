import React, { Component } from 'react';
import { List, Row, Col } from 'antd';
import ExtensibleSearch from './ExtensibleSearch';
import indexStyle from './index.less';

class ExtendedList extends Component {
    dataSource = [
        {
            title: '空调机组001',
            SupAirTemp: 32,
            SupAirHumidity: 20,
            ReturnTemp: 28,
        },
        {
            title: '空调机组002',
            SupAirTemp: 30,
            SupAirHumidity: 25,
            ReturnTemp: 26,
        },
        {
            title: '空调机组003',
            SupAirTemp: 35,
            SupAirHumidity: 26,
            ReturnTemp: 27,
        },
        {
            title: '空调机组004',
            SupAirTemp: 28,
            SupAirHumidity: 30,
            ReturnTemp: 24,
        },
        {
            title: '空调机组005',
            SupAirTemp: 26,
            SupAirHumidity: 22,
            ReturnTemp: 23,
        },
        {
            title: '空调机组006',
            SupAirTemp: 28,
            SupAirHumidity: 24,
            ReturnTemp: 22,
        },
        {
            title: '空调机组007',
            SupAirTemp: 24,
            SupAirHumidity: 20,
            ReturnTemp: 18,
        },
        {
            title: '空调机组008',
            SupAirTemp: 22,
            SupAirHumidity: 19,
            ReturnTemp: 16,
        },
        {
            title: '空调机组009',
            SupAirTemp: 30,
            SupAirHumidity: 26,
            ReturnTemp: 25,
        },
        {
            title: '空调机组010',
            SupAirTemp: 33,
            SupAirHumidity: 23,
            ReturnTemp: 25,
        },
        {
            title: '空调机组011',
            SupAirTemp: 35,
            SupAirHumidity: 24,
            ReturnTemp: 26,
        },
        {
            title: '空调机组012',
            SupAirTemp: 38,
            SupAirHumidity: 20,
            ReturnTemp: 28,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            doorList: [
                {
                    id: '1',
                    name: '全部',
                },
                {
                    id: '2',
                    name: '东门',
                },
                {
                    id: '3',
                    name: '西门',
                },
            ],
        };
    }

    onChange = (page, pageSize) => {
        this.setState({ page, pageSize });
    };

    handleSearch = () => {
    };

    resetSearch = () => {
    };

    render() {
        const { doorList, pageSize, page } = this.state;
        const totalElements = this.dataSource.length;
        const totalPage = parseInt(totalElements / 10, 10) + 1;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                    共<a>{totalPage}</a>页/<a>{totalElements}</a>条数据
                    </span>
                );
            },
            total: totalElements,
            pageSize,
            current: parseInt(page, 10) || 1,
            onChange: (current, pagesize) => { return this.onChange(current, pagesize); },
        };
        return (
            <div>
                <div className="content">
                    <ExtensibleSearch doorList={doorList} handleSearch={this.handleSearch} resetSearch={this.resetSearch} ></ExtensibleSearch>
                </div>
                <div className="content mt20">
                    <List
                        grid={{
                            gutter: 16,
                            xs: 2,
                            sm: 3,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                        }}
                        className="mt20"
                        itemLayout="horizontal"
                        dataSource={this.dataSource}
                        pagination={pagination}
                        renderItem={item => {
                            return (
                                <List.Item>
                                    <div className={indexStyle.overListItem}>
                                        <Row gutter={16}>
                                            <Col className="gutter-row" span={24}>
                                                <p className="mb10">
                                                    <b>{item.title}</b>
                                                </p>
                                                <ul className="ml10">
                                                    <li>送风温度：{item.SupAirTemp}℃</li>
                                                    <li>送风湿度：{item.SupAirHumidity}%RH</li>
                                                    <li>回风温度：{item.ReturnTemp}℃</li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>
                            );
                        }}
                    ></List>
                </div>
            </div>
        );
    }
}

export default ExtendedList;
