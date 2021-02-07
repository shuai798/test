import { Avatar, Icon, Menu, Dropdown, Modal, Form, Input, message, Row, Col } from 'antd';
import React from 'react';
import { connect } from 'dva';
import validation from '@/utils/validation';
import router from 'umi/router';
import styles from '../index.less';

@Form.create()
class AvatarDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            userName: '',
            avatarColor: '',
            changePwdVisible: false,
            pwdStrenth: null,
        };
    }

    componentDidMount() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let accountUserName = '测试';
        if (userInfo && userInfo.realName) {
            accountUserName = userInfo.realName;
        }
        const avatarColorList = ['#7e71d8', '#659fd5', '#53b15b', '#d89244', '#cb617f', '#37bcb3', '#cc6271', '#25bce6', '#ba9954', '#a664bc'];
        let avatarColorInfo = avatarColorList[Math.floor(Math.random() * 10)];
        if (localStorage.getItem('avatarColor')) {
            avatarColorInfo = localStorage.getItem('avatarColor');
        } else {
            localStorage.setItem('avatarColor', avatarColorInfo);
        }
        this.setState({
            userName: accountUserName,
            avatarColor: avatarColorInfo,
        });
        this.changeColor('#4DB22F');
    }

    changeColor = (color) => {
        const { dispatch } = this.props;
        if (color === 'light' || color === 'dark') {
            // 切换主题，功能待扩展
            localStorage.setItem('navTheme', color);
            dispatch({
                type: 'settings/changeSetting',
                payload: {
                    navTheme: color,
                },
            });
        } else {
            // 切换皮肤
            localStorage.setItem('primaryColor', color);
            dispatch({
                type: 'settings/changeSetting',
                payload: {
                    primaryColor: color,
                },
            });
        }
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onMenuClick = (event) => {
        const { key } = event;
        const { dispatch } = this.props;
        switch (key) {
            case 'logout':
                Modal.confirm({
                    content: '确定要退出登录吗？',
                    title: '提示',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        if (dispatch) {
                            dispatch({
                                type: 'login/logout',
                            });
                        }
                        localStorage.clear();
                        //适配跨系统cookie
                        localStorage.clear();
                    },
                });
                break;
            case 'personalCenter':
                router.push('/systemManagement/personalCenter');
                break;
            case 'changepwd':
                this.setState({
                    changePwdVisible: true,
                });
                break;
            default:
                break;
        }
    };

    submitPwd = () => {
        const { form } = this.props;
        const { dispatch } = this.props;

        form.validateFields((err) => {
            if (err) {
                return;
            }
            const oldPwd = form.getFieldValue('oldPwd');
            const confirmPwd = form.getFieldValue('confirmPwd');
            const pwdData = {
                mobile: JSON.parse(localStorage.getItem('userInfo')).mobile,
                oldPassword: oldPwd,
                password: confirmPwd,
            };
            dispatch({
                type: 'forgetPassword/changePassword',
                payload: pwdData,
                callback: () => {
                    this.setState({
                        changePwdVisible: false,
                    });
                    message.success('密码修改成功');
                    form.resetFields();
                    router.replace('/login');
                },
            });
        });
    };

    validateConfirmPwd = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPwd')) {
            callback('两次密码不一致');
        }
        callback();
    };

    validatePwdStenth = (rule, value, callback) => {
        const that = this;
        const strong = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);
        const weak = new RegExp(/^(?:\d+|[a-z]+|[A-Z]+)$/);
        if (value && strong.test(value)) {
            that.setState({
                pwdStrenth: 'strong',
            });
        } else if (value && weak.test(value)) {
            that.setState({
                pwdStrenth: 'weak',
            });
        } else if (!value) {
            that.setState({
                pwdStrenth: '',
            });
        } else {
            that.setState({
                pwdStrenth: 'mid',
            });
        }
        callback();
    };

    cancelPwd = () => {
        this.setState({
            changePwdVisible: false,
        });
    };

    render() {
        const { avatarColor, userName, changePwdVisible } = this.state;
        const avatarName = userName.substring(0, 1);
        const { getFieldDecorator } = this.props.form;
        const menuHeaderDropdown = (
            <Menu className={styles.headerMenu} selectedKeys={[]} onClick={this.onMenuClick} style={{ width: 144 }}>
                <Menu.Item key="personalCenter">
                    <Icon type="user" style={{ fontSize: '16px', color: '#4DB22F', position: 'relative', top: 3 }} />
                    <span>个人中心</span>
                </Menu.Item>
                {/*<Menu.Item key="changepwd">*/}
                {/*    <span className="iconfont icon-user-center mr16"></span>*/}
                {/*    <span>修改密码</span>*/}
                {/*</Menu.Item>*/}
                {/* <Menu.Divider /> */}
                <Menu.Item key="logout">
                    <Icon type="poweroff" style={{ fontSize: '16px', color: '#4DB22F', position: 'relative', top: 3 }} />
                    <span>退出登录</span>
                </Menu.Item>
            </Menu>
        );
        const colorList = ['#0086FF', '#7e71d8', '#659fd5', '#53b15b', '#d89244', '#cb617f', '#37bcb3', '#cc6271', '#25bce6', '#ba9954', '#a664bc'];
        return (
            <span>
                <Dropdown overlay={menuHeaderDropdown}>
                    <span className={styles.trigger}>
                        <Avatar className={styles.avatar} style={{ background: avatarColor }} alt="avatar">
                            {avatarName}
                        </Avatar>
                        <span className="ml5 mr5">{userName}</span>
                        <Icon type="down" className="ml5 mr5 mb5"></Icon>
                    </span>
                </Dropdown>
                {/*<Drawer title="外观设置" placement="right" closable={false} onClose={this.onClose} visible={visible}>*/}
                {/*    /!* <div className="mt12 mb12">整体风格设置:</div>*/}
                {/*    <Radio.Group onChange={this.onChange} defaultValue={localStorage.getItem('navTheme')}>*/}
                {/*        <Radio.Button value="light">light</Radio.Button>*/}
                {/*        <Radio.Button value="dark">dark</Radio.Button>*/}
                {/*    </Radio.Group> *!/*/}
                {/*    <div className="mb8">主题色：</div>*/}
                {/*    <ThemeBox colorList={colorList} changeCheckedColor={this.changeColor}></ThemeBox>*/}
                {/*</Drawer>*/}
                <Modal title="修改密码" visible={changePwdVisible} onOk={this.submitPwd} confirmLoading={this.props.confirmLoading} onCancel={this.cancelPwd}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label="旧密码：">
                                    {getFieldDecorator('oldPwd', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入旧密码',
                                            },
                                        ],
                                    })(<Input.Password placeholder="请输入旧密码" />)}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="新密码：">
                                    {getFieldDecorator('newPwd', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入新密码',
                                            },
                                            { validator: validation.Rule_password },
                                            { validator: this.validatePwdStenth },
                                        ],
                                    })(<Input.Password placeholder="请输入新密码" />)}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="新密码：">
                                    {getFieldDecorator('confirmPwd', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请再次输入新密码',
                                            },
                                            {
                                                validator: this.validateConfirmPwd,
                                            },
                                        ],
                                    })(<Input.Password placeholder="请再次输入新密码" />)}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={6}>
                                        <div className="text-right color-font-placeholder">密码强度：</div>
                                    </Col>
                                    <Col span={18}>
                                        <span className={`${styles['password-strenth']} ${this.state.pwdStrenth === 'strong' ? styles.strong : ''} ${this.state.pwdStrenth === 'mid' ? styles.mid : ''} ${this.state.pwdStrenth === 'weak' ? styles.weak : ''}`}>弱</span>
                                        <span className={`${styles['password-strenth']} ${this.state.pwdStrenth === 'strong' ? styles.strong : ''} ${this.state.pwdStrenth === 'mid' ? styles.mid : ''}`}>中</span>
                                        <span className={`${styles['password-strenth']} ${this.state.pwdStrenth === 'strong' ? styles.strong : ''}`}>强</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default connect(({ loading, settings, login }) => {
    return {
        settings,
        login,
        confirmLoading: loading.effects['login/changePassword'],
    };
})(AvatarDropdown);
