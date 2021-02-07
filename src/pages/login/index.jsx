import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import logo from '@/assets/images/login/logo.png';
import logoLeft from '@/assets/images/login/left.png';
import router from 'umi/router';
import storage from '@/utils/storage';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ loading, login }) => {
    return {
        login,
        submitLoading: loading.effects['login/loginSystem'],
    };
})
@Form.create()
class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                // 登录获取token
                const { account, password } = values;
                dispatch({
                    type: 'login/loginSystem',
                    payload: {
                        username: account,
                        password,
                        client_secret: '123456',
                        client_id: 'web',
                        grant_type: 'password',
                    },
                    callback: () => {
                        // 通过token获取系统列表
                        dispatch({
                            type: 'login/authClients',
                            payload: {},
                            callback(list) {
                                storage.saveStorage('clientId', list[0].id);
                                // 如果系统数量大于1，默认选中第一个
                                storage.saveStorage('choosedSystem', list[0]);
                                dispatch({
                                    type: 'login/authMe',
                                    payload: { clientId: list[0].id },
                                    callback: () => {
                                        dispatch({
                                            type: 'login/menuList',
                                            payload: { clientId: list[0].id },
                                            callback: (response) => {
                                                router.push(response[0].path);
                                            },
                                        });
                                        dispatch({
                                            type: 'login/downloadUrl',
                                            callback: (response) => {
                                                storage.saveStorage('downloadUrl', response);
                                            },
                                        });
                                    },
                                });
                            },
                        });
                    },
                });
            }
        });
    };

    changePassword = () => {
        this.props.history.push('/forgetPassword');
    };

    render() {
        const {
            form: { getFieldDecorator },
            submitLoading,
        } = this.props;
        return (
            <div>
                <div className={styles.loginLeft}>
                    <div className={styles.welcomeTitle}>欢迎来到百傲瑞通</div>
                    <img className={styles.leftImg} src={logoLeft} alt=""></img>
                </div>
                <div className={styles.loginRight}>
                    <img src={logo} className={styles.logoImg} alt=""></img>
                    <div className={styles.loginBox}>
                        <div className={styles.loginTitle}>用户登录</div>
                        <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                            <div className={styles.inputTitle}>账号</div>
                            <FormItem>
                                {getFieldDecorator('account', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入用户名！',
                                        },
                                        {
                                            pattern: /^[^\s]*$/,
                                            message: '禁止输入空格',
                                        },
                                    ],
                                })(<Input autoComplete="off" placeholder="请输入用户名称" className={styles.loginInput} maxLength={32}></Input>)}
                            </FormItem>
                            <div className={styles.inputTitle}>密码</div>
                            <FormItem className="mb24">
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入密码！',
                                        },
                                        {
                                            pattern: /^[^\s]*$/,
                                            message: '禁止输入空格',
                                        },
                                    ],
                                })(<Input.Password autoComplete="off" type="password" placeholder="请输入登录密码" className={styles.loginInput} maxLength={32}></Input.Password>)}
                            </FormItem>
                            <a className={styles.loginFormForgot} onClick={this.changePassword}>
                                忘记密码
                            </a>
                            <Button type="primary" htmlType="submit" className={styles.loginFormButton} loading={submitLoading}>
                                登录
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
