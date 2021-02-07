import React, { Component } from 'react';
import { Descriptions, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import styles from '../style.less';

@connect(({ personalCenter }) => {
    return {
        personalCenter,
    };
})
class PersonalInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getPersonalInformationDetail();
    }

    getPersonalInformationDetail = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'personalCenter/getPersonalInformationDetail',
        });
    };

    updateResetPasswordModal = () => {
        this.props.updateResetPasswordModal();
    };

    updateUpdateNameModal = () => {
        this.props.updateUpdateNameModal();
    };

    updateUpdatePhoneModal = () => {
        this.props.updateUpdatePhoneModal();
    };

    render() {
        const { personalInformationDetail = {} } = this.props.personalCenter;
        return (
            <div className="content">
                <div className={styles['personal-top']}>
                    <div className={styles['personal-title']}>个人信息</div>
                    <div>
                        <a onClick={this.updateResetPasswordModal}>
                            重置密码<span className="iconfont icon-reset-passwords ml8 fz14"></span>
                        </a>
                    </div>
                </div>
                <Divider className="mt16 mb16"></Divider>
                <div className={styles['person-center']}>
                    <div className={styles['info-item']}>
                        <div className={styles['item-name']}>人员姓名：</div>
                        <div className={`${styles['item-value']} ${styles['item-value-width']}`} title={personalInformationDetail.name || '--'}>
                            {personalInformationDetail.name || '--'}
                        </div>
                        <a onClick={this.updateUpdateNameModal}>
                            <span className="iconfont icon-focus-edit ml8 fz14" style={{ color: '#2F6CFF' }}></span>
                        </a>
                    </div>
                    <div className={styles['info-item']}>
                        <div className={styles['item-name']}>手机号码：</div>
                        <div className={`${styles['item-value']} ${styles['item-value-width']}`} title={personalInformationDetail.mobile || '--'}>
                            {personalInformationDetail.mobile || '--'}
                        </div>
                        <a onClick={this.updateUpdatePhoneModal}>
                            <span className="iconfont icon-focus-edit ml8 fz14" style={{ color: '#2F6CFF' }}></span>
                        </a>
                    </div>
                    <div className={styles['info-item']}>
                        <div className={styles['item-name']}>所属组织：</div>
                        <div className={styles['item-value']}>
                            {personalInformationDetail.organizationName || '--'}
                        </div>
                    </div>
                    <div className={styles['info-item']}>
                        <div className={styles['item-name']}>在职状态：</div>
                        <div className={styles['item-value']}>
                            {personalInformationDetail.status ? '在职' : '离职'}
                        </div>
                    </div>
                    <div className={styles['info-item']}>
                        <div className={styles['item-name']}>移动端角色：</div>
                        <div className={styles['item-value']}>
                            {personalInformationDetail.mobileRoleNames || '--'}
                        </div>
                    </div>
                    <div className={styles['info-item']}>
                        <div className={styles['item-name']}>后台角色：</div>
                        <div className={styles['item-value']}>
                            {personalInformationDetail.roleNames || '--'}
                        </div>
                    </div>
                    <Divider className="mt28 mb16"></Divider>
                    <div className={styles['divider-blank']}></div>
                    <div className={styles['info-item']} style={{ marginTop: 0 }}>
                        <div className={styles['item-name']}>负责客户：</div>
                        <div className={styles['item-value']}>
                            {personalInformationDetail.customerNames || '--'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PersonalInformation;
