import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import PersonalInformation from './components/PersonalInformation';
import ResetPassword from './components/ResetPassword';
import UpdateName from './components/UpdateName';
import UpdatePhone from './components/UpdatePhone';

@connect(({ personalCenter }) => {
    return {
        personalCenter,
    };
})
class PersonalCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowResetPasswordModal: false,
            isShowUpdateName: false,
            isShowUpdatePhone: false,
        };
    }

    componentDidMount() {}

    updateResetPasswordModal = () => {
        this.setState((prevState) => {
            return { isShowResetPasswordModal: !prevState.isShowResetPasswordModal };
        });
    };

    updateUpdateNameModal = () => {
        this.setState((prevState) => {
            return { isShowUpdateName: !prevState.isShowUpdateName };
        });
    };

    updateUpdatePhoneModal = () => {
        this.setState((prevState) => {
            return { isShowUpdatePhone: !prevState.isShowUpdatePhone };
        });
    };

    onRef = (ref) => {
        this.child = ref;
    };

    getPersonalInformationDetail = () => {
        this.child.getPersonalInformationDetail();
    };

    render() {
        const { isShowResetPasswordModal, isShowUpdateName, isShowUpdatePhone } = this.state;
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <PersonalInformation updateResetPasswordModal={this.updateResetPasswordModal} updateUpdateNameModal={this.updateUpdateNameModal} updateUpdatePhoneModal={this.updateUpdatePhoneModal} onRef={this.onRef}></PersonalInformation>
                {isShowResetPasswordModal && <ResetPassword updateResetPasswordModal={this.updateResetPasswordModal} getPersonalInformationDetail={this.getPersonalInformationDetail}></ResetPassword>}
                {isShowUpdateName && <UpdateName updateUpdateNameModal={this.updateUpdateNameModal} getPersonalInformationDetail={this.getPersonalInformationDetail}></UpdateName>}
                {isShowUpdatePhone && <UpdatePhone updateUpdatePhoneModal={this.updateUpdatePhoneModal} getPersonalInformationDetail={this.getPersonalInformationDetail}></UpdatePhone>}
            </div>
        );
    }
}

export default PersonalCenter;
