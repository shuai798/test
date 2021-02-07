import React, { Component } from 'react';
import { Steps, Form, Button, Input, message } from 'antd';
import validation from '@/utils/validation';
import Captcha from 'react-captcha-code';
import { connect } from 'dva';
import logo from '@/assets/images/login/logo.png';
import { HxIcon } from '@/components/hx-components';
import styles from '../style.less';

const FormItem = Form.Item;
const { Step } = Steps;

const steps = [
    {
        title: '获取验证',
        content: 'First-content',
    },
    {
        title: '身份验证',
        content: 'Second-content',
    },
    {
        title: '重置密码',
        content: 'Last-content',
    },
    {
        title: '完成找回',
        content: 'Last-content',
    },
];

@connect(({ loading, forgetPassword }) => {
    return {
        forgetPassword,
        checkMobileLoading: loading.effects['forgetPassword/checkMobile'],
    };
})
@Form.create()
class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 标题序号
            validateCode: '', // 验证码
            buttonValue: '重新发送',
            seconds: 60,
            btnDisabled: false,
            pwdStrenth: '', // 密码强度
            phone: '',
        };
    }

    // 下一个
    next = () => {
        const { current } = this.state;
        const { dispatch, form } = this.props;
        if (current === 0) {
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let value = values;
                delete value.photoode;
                dispatch({
                    type: 'forgetPassword/checkMobile',
                    payload: { ...value },
                    callback: () => {
                        this.setState({ current: current + 1, phone: value.mobile }, () => {
                            value = { ...value, businessType: 'CHANGE_PASSWORD' };
                            dispatch({
                                type: 'forgetPassword/sendCode',
                                payload: { ...value },
                                callback: () => {},
                            });
                        });
                    },
                });
            });
        }
        if (current === 1) {
            const { phone } = this.state;
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let value = values;
                value = { ...value, businessType: 'CHANGE_PASSWORD', mobile: phone };
                dispatch({
                    type: 'forgetPassword/checkCode',
                    payload: { ...value },
                    callback: () => {
                        this.setState({ current: current + 1 });
                    },
                });
            });
        }
        if (current === 2) {
            const { phone } = this.state;
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let value = values;
                delete value.newPassword;
                value = { ...value, mobile: phone };
                dispatch({
                    type: 'forgetPassword/changePassword',
                    payload: { ...value },
                    callback: () => {
                        message.success('密码重置成功');
                        this.setState({ current: current + 1 });
                    },
                });
            });
        }
    };

    // 上一个
    prev = () => {
        const { current } = this.state;
        this.setState({ current: current - 1 });
    };

    // 重新登录
    goLogin = () => {
        this.props.history.push('/login');
    };

    // 获取验证码
    handleClick = (e) => {
        this.setState({ validateCode: e });
    };

    // 图形验证码校验
    getValidateCode = (rule, value, callback) => {
        const { validateCode } = this.state;
        if (value === '' || value === undefined) {
            callback('请输入图形验证码');
        }
        if (value.toLocaleLowerCase() !== validateCode.toLocaleLowerCase()) {
            callback('验证码不正确');
        }
        callback();
    };

    // 开启定时器
    changeButtonValue = () => {
        this.setState(
            {
                btnDisabled: true,
            },
            () => {
                this.getCode();
                this.interval = setInterval(() => {
                    return this.tick();
                }, 1000);
            },
        );
    };

    // 定时器
    tick = () => {
        const { seconds } = this.state;
        this.setState((prevState) => {
            return {
                seconds: prevState.seconds - 1,
                buttonValue: `${prevState.seconds - 1}秒`,
            };
        });
        if (seconds === 1) {
            clearInterval(this.interval);
            this.setState({
                buttonValue: '重新发送',
                seconds: 60,
                btnDisabled: false,
            });
        }
    };

    // 新旧密码校验
    validateConfirmPwd = (rule, value, callback) => {
        if (value && value !== this.props.form.getFieldValue('password')) {
            callback('两次密码不一致');
        }
        callback();
    };

    // 判断密码强度
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

    // 再次获取验证码
    getCode = () => {
        const { dispatch } = this.props;
        const { phone } = this.state;
        const value = { mobile: phone, businessType: 'CHANGE_PASSWORD' };
        dispatch({
            type: 'forgetPassword/sendCode',
            payload: { ...value },
            callback: () => {},
        });
    };

    //中间输入框
    countInfo = () => {
        const { current, buttonValue, btnDisabled, pwdStrenth } = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
        const suffix = <Captcha charNum={4} height="44" onChange={this.handleClick}></Captcha>;
        // 获取验证
        if (current === 0) {
            return (
                <div className={styles.stepOneBox}>
                    <Form className={styles.stepOne} onSubmit={this.handleSubmitPhone}>
                        <div className={styles.inputTitle}>请输入注册手机号</div>
                        <FormItem>
                            {getFieldDecorator('mobile', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入手机号',
                                    },
                                    {
                                        validator: validation.Rule_tel,
                                    },
                                ],
                            })(<Input autoComplete="off" placeholder="请输入手机号"></Input>)}
                        </FormItem>
                        <FormItem className={styles.code}>
                            {getFieldDecorator('photoCode', {
                                rules: [{ validator: this.getValidateCode }],
                            })(<Input suffix={suffix} autoComplete="off" placeholder="请输入图形验证码" maxLength={4}></Input>)}
                        </FormItem>
                    </Form>
                </div>
            );
        }
        // 身份验证
        if (current === 1) {
            const { phone } = this.state;
            return (
                <div className={styles.stepOneBox}>
                    <Form className={styles.stepSecond}>
                        <div className={styles.inputTitleSecond}>验证码已发送至：{phone}</div>
                        <FormItem>
                            {getFieldDecorator('code', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入验证码',
                                    },
                                ],
                            })(<Input autoComplete="off" placeholder="验证码"></Input>)}
                        </FormItem>
                    </Form>
                    <Button disabled={btnDisabled} onClick={this.changeButtonValue} className={styles.but} type="primary" ghost>
                        {buttonValue}
                    </Button>
                </div>
            );
        }
        // 重置密码
        if (current === 2) {
            return (
                <div className={styles.stepOneBox}>
                    <Form className={styles.stepThird}>
                        <div className={styles.inputTitleThird}>密码为6~20位，字母、数字</div>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入新密码',
                                    },
                                    { validator: validation.Rule_password },
                                    { validator: this.validatePwdStenth },
                                ],
                            })(<Input.Password autoComplete="off" placeholder="新密码"></Input.Password>)}
                        </FormItem>
                        <div className={styles.passwordStrenthBox}>
                            <span className={`${styles['password-strenth']} ${pwdStrenth === 'strong' ? styles.strong : ''} ${pwdStrenth === 'mid' ? styles.mid : ''} ${pwdStrenth === 'weak' ? styles.weak : ''}`}>
                                <span className={`${styles.strenthFont} ${pwdStrenth !== '' ? styles.strenthFontColor : ''}`}>弱</span>
                            </span>
                            <span className={`${styles['password-strenth']} ${pwdStrenth === 'strong' ? styles.strong : ''} ${pwdStrenth === 'mid' ? styles.mid : ''}`}>
                                <span className={`${styles.strenthFont} ${pwdStrenth === 'mid' || pwdStrenth === 'strong' ? styles.strenthFontColor : ''}`}>中</span>
                            </span>
                            <span className={`${styles['password-strenth']} ${pwdStrenth === 'strong' ? styles.strong : ''}`}>
                                <span className={`${styles.strenthFont} ${pwdStrenth === 'strong' ? styles.strenthFontColor : ''}`}>强</span>
                            </span>
                        </div>
                        <FormItem>
                            {getFieldDecorator('newPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请再次输入新密码',
                                    },
                                    { validator: validation.Rule_password },
                                    { validator: this.validateConfirmPwd },
                                ],
                            })(<Input.Password autoComplete="off" placeholder="重复新密码"></Input.Password>)}
                        </FormItem>
                    </Form>
                </div>
            );
        }
        // 完成找回
        if (current === 3) {
            return (
                <div className={styles.stepFourBox}>
                    <HxIcon className={styles.successIcon} type="icon-success2"></HxIcon>
                    <div className={styles.inputTitleFour}>密码重置成功</div>
                </div>
            );
        }
    };

    render() {
        const { current } = this.state;
        return (
            <div className={styles.parent}>
                <img src={logo} className={styles.logoImg} alt=""></img>
                <div className={styles.largeBox}>
                    <Steps current={current} labelPlacement="vertical" className={styles.steps}>
                        {steps.map((item) => {
                            return <Step key={item.title} title={item.title}></Step>;
                        })}
                    </Steps>
                    <div className={styles.steps_content}>{this.countInfo()}</div>
                    <div className={styles.steps_action}>
                        {current > 0 && current < 3 ? (
                            <Button
                                onClick={() => {
                                    return this.prev();
                                }}>
                                上一步
                            </Button>
                        ) : null}
                        {current < steps.length - 1 && (
                            <Button
                                style={{ marginLeft: 16 }}
                                type="primary"
                                onClick={() => {
                                    return this.next();
                                }}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={this.goLogin}>
                                重新登录
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgetPassword;
