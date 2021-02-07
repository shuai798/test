import React from 'react';
import { Table, Button, Checkbox, Icon, DatePicker } from 'antd';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;

export default class FilterSelectAllTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: this.props.columns,
            // rowSelection: this.props.rowSelection ? this.props.rowSelection : null,
            scroll: this.props.scroll ? this.props.scroll : {},
            selectedRowKeys: this.props.selectedRows ? this.props.selectedRows : [],
        };
    }

    componentDidMount() {
        const { columns } = this.state;

        for (const i in columns) {
            if (columns[i].hasOwnProperty('filterType')) {
                this.getColumnSearchProps(i);
            }
        }

        this.setState({
            columns,
        });
    }

    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.columns !== this.state.columns) {
    //         return true;
    //     }
    //     return false;
    // }
    //
    // componentDidUpdate() {
    //     setTimeout(() => {
    //         this.barChart.resize();
    //     }, 300);
    // }
    //
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.deviceTop30Data !== prevState.deviceTop30Data) {
    //         return { deviceTop30Data: nextProps.deviceTop30Data };
    //     }
    //     return null;
    // }
    //
    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.barChart.resize);
    // }
    //
    // getSnapshotBeforeUpdate(nextProps, prevState) {
    //     if (nextProps.deviceTop30Data !== prevState.deviceTop30Data) {
    //         return { deviceTop30Data: nextProps.deviceTop30Data };
    //     }
    //     this.initChart();
    //     return null;
    // }

    getColumnSearchProps = (columnIndex) => {
        const { columns } = this.state;
        let filterConfig = null;

        if (columns[columnIndex].filterType === 'multipleChoice' && columns[columnIndex].filters) {
            columns[columnIndex].checkAll = false;
            columns[columnIndex].filteredValue = [];
            filterConfig = this.getColumnSearchMultipleChoice(columnIndex);
            columns[columnIndex].filterDropdown = filterConfig.filterDropdown;
            columns[columnIndex].filterIcon = filterConfig.filterIcon;
        } else if (columns[columnIndex].filterType === 'timeRanger') {
            columns[columnIndex].filteredValue = {};
            filterConfig = this.getColumnSearchTimeRanger(columnIndex);
            columns[columnIndex].filterDropdown = filterConfig.filterDropdown;
            columns[columnIndex].filterIcon = filterConfig.filterIcon;
        }
    };

    getColumnSearchMultipleChoice = (columnIndex) => {
        const { columns } = this.state;
        const { handleTableSearch } = this.props;
        return {
            filterDropdown: ({ confirm }) => {
                return (
                    <div className={styles.columnsSearch}>
                        <div>
                            <Checkbox
                                onChange={(e) => {
                                    return this.checkAllOnChange(e, columnIndex);
                                }}
                                checked={columns[columnIndex].checkAll}>
                                全部
                            </Checkbox>
                        </div>
                        <CheckboxGroup
                            options={columns[columnIndex].filters}
                            value={columns[columnIndex].filteredValue}
                            onChange={(checkedList) => {
                                return this.checkBoxOnChange(checkedList, columnIndex);
                            }}></CheckboxGroup>
                        <div className={styles.checkBoxButton}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    return handleTableSearch(confirm, columns);
                                }}
                                size="small">
                                确定
                            </Button>
                        </div>
                    </div>
                );
            },
            filterIcon: () => {
                return <Icon type="filter" theme="filled" style={{ color: columns[columnIndex].filteredValue.length > 0 ? '#4db22f' : '' }} />;
            },
        };
    };

    checkAllOnChange = (e, columnIndex) => {
        const { columns } = this.state;
        columns[columnIndex].filteredValue = e.target.checked ? this.setFilterDropdownAllSelected(columns[columnIndex].filters) : [];
        columns[columnIndex].checkAll = e.target.checked;
        this.setState({
            columns,
        });
    };

    checkBoxOnChange = (checkedList, columnIndex) => {
        const { columns } = this.state;

        columns[columnIndex].filteredValue = checkedList;
        columns[columnIndex].checkAll = checkedList.length === columns[columnIndex].filters.length;
        this.setState({
            columns,
        });
    };

    setFilterDropdownAllSelected = (list) => {
        const selectedValue = [];
        list.map((item) => {
            selectedValue.push(item.value);
        });
        return selectedValue;
    };

    getColumnSearchTimeRanger = (columnIndex) => {
        const { columns } = this.state;
        const { handleTableSearch } = this.props;
        return {
            filterDropdown: ({ confirm }) => {
                return (
                    <div className={styles.datePickerSearch}>
                        <div className={styles.datePickerItem}>
                            <DatePicker
                                disabledDate={(value) => {
                                    return this.disabledStartDate(value, columnIndex);
                                }}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="开始时间"
                                onChange={(value) => {
                                    return this.onStartChange(value, columnIndex);
                                }}
                            />
                        </div>
                        <div>
                            <DatePicker
                                disabledDate={(value) => {
                                    return this.disabledEndDate(value, columnIndex);
                                }}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="结束时间"
                                onChange={(value) => {
                                    return this.onEndChange(value, columnIndex);
                                }}
                            />
                        </div>
                        <div className={styles.datePickerButton}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    return handleTableSearch(confirm, columns);
                                }}
                                size="small">
                                确定
                            </Button>
                        </div>
                    </div>
                );
            },
            filterIcon: () => {
                return <Icon type="clock-circle" theme="filled" style={{ color: columns[columnIndex].filteredValue.startValue || columns[columnIndex].filteredValue.endValue ? '#4db22f' : undefined }} />;
            },
        };
    };

    handleRangeTimeChange = (momentActiveTime, stringActiveTime, columnIndex) => {
        const { columns } = this.state;

        columns[columnIndex].filteredValue = momentActiveTime;
        this.setState({
            columns,
        });
    };

    disabledStartDate = (startValue, columnIndex) => {
        const { endValue } = this.state.columns[columnIndex]?.filteredValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue, columnIndex) => {
        const { startValue } = this.state.columns[columnIndex]?.filteredValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onStartChange = (value, columnIndex) => {
        const { columns } = this.state;
        columns[columnIndex].filteredValue.startValue = value;
        this.setState({
            columns,
        });
    };

    onEndChange = (value, columnIndex) => {
        const { columns } = this.state;
        columns[columnIndex].filteredValue.endValue = value;
        this.setState({
            columns,
        });
    };

    render() {
        const { rowKey, loading, dataSource, onChange, pagination, selectedRows, rowSelection, bordered } = this.props;
        const { columns, scroll, selectedRowKeys } = this.state;
        const rowSelections = selectedRows
            ? {
                selectedRowKeys,
                onChange: (selectedRow) => {
                    this.setState({
                        selectedRowKeys: selectedRow,
                    });
                    this.props.getSelectedRowKeys(selectedRow);
                },
            }
            : rowSelection;
        return <Table rowKey={rowKey} loading={loading} columns={columns} dataSource={dataSource} onChange={onChange} pagination={pagination} rowSelection={rowSelections} scroll={scroll} bordered={bordered}></Table>;
    }
}
