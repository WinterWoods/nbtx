import React, { Component } from 'react';
import { render } from 'react-dom';
import { Modal, Input, Switch, message } from 'antd';
import './editPassword.less';

import Util from './mod/util/util.js'
export default class EditPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            newPassword1: ""
        }
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        var self = this;
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    handleOk() {
        var self = this;
        if (this.state.oldPassword == "" || this.state.newPassword == "" || this.state.newPassword1 == "") {
            message.error("请填写所有信息");
            return;
        }
        if (this.state.newPassword != this.state.newPassword1) {
            message.error("两次新密码不一致");
            return;
        }
        if (this.state.oldPassword == this.state.newPassword) {
            message.error("新密码不能等于旧密码");
            return;
        }
        var reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
        console.log(reg.test(this.state.newPassword));
        if (!reg.test(this.state.newPassword)) {
            message.error("不能密码设置过于简单,请大于6位,并包含数字字母");
            return;
        }
        window.userManager.editPassword({ OldPassword: this.state.oldPassword, Password: this.state.newPassword })
            .done(function(result) {
                //注册快捷键
                self.setState({
                    oldPassword: "",
                    newPassword: "",
                    newPassword1: ""
                });
                self.props.closeModal();
            });
    }
    handleCancel() {
        this.props.closeModal();
    }
    render() {
        return (<Modal title="修改密码" visible={this.props.visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            wrapClassName="editPassword"
            width={365}
            >
            <div className="panel">
                <div className="one">
                    <div className="lable">
                        原密码:
                    </div>
                    <div className="context">
                        <Input value={this.state.oldPassword} type='password' onChange={function(value) { this.setState({ oldPassword: value.target.value }); }.bind(this)} autoComplete="off" placeholder="旧密码" />
                    </div>
                </div>
                <div className="one">
                    <div className="lable">
                        新密码:
                    </div>
                    <div className="context">
                        <Input value={this.state.newPassword} type='password' onChange={function(value) { this.setState({ newPassword: value.target.value }); }.bind(this)} autoComplete="off" placeholder="新密码" />
                    </div>
                </div>
                <div className="one">
                    <div className="lable">
                        新密码:
                    </div>
                    <div className="context">
                        <Input value={this.state.newPassword1} type='password' onChange={function(value) { this.setState({ newPassword1: value.target.value }); }.bind(this)} autoComplete="off" placeholder="新密码" />
                    </div>
                </div>
            </div>

        </Modal>);
    }
}

EditPassword.propTypes = {};
EditPassword.defaultProps = {
    visible: false,
    closeModal: function() { }
};