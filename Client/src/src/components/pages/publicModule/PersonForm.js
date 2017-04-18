import React, { Component } from 'react';
import { Modal, Button, Spin } from 'antd';

import './PersonForm.less';
import { hashHistory } from 'react-router'

import HeadImg from '../publicModule/headImg.js'
export default class PersonForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            loading: true
        }
    }
    componentDidMount() {
        //根据key查询用户信息
        if (this.props.userKey)
            this.reloadInfo(this.props.userKey);
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    handleOk() {
        //发送消息
        var self = this;
        window.OftenListAdd(self.props.userKey, "1");
        // window.msgManager.myOftenListAdd({ FriendKey: self.props.userKey, Type: "1" })
        //     .done(function (result) {
        //         for (var i = 0; i < window.oftens.length; i++) {
        //             if (window.oftens[i].Key == result.Key) {
        //                 window.oftens.splice(i, 1);
        //                 break;
        //             }
        //         }
        //         window.oftens.splice(0, 0, result);
        //         hashHistory.replace(window.defaultSelectedKey);
        //         self.props.handleCancel();
        //     });
    }
    reloadInfo(key) {
        var self = this;
        self.setState({ loading: true })

        window.orgManager.userInfo({ UserKey: key })
            .done(function (result) {
                self.setState({ userInfo: result, loading: false });
            });
    }
    componentWillReceiveProps(nextProps) {
        var self = this;
        if (self.props.userKey != nextProps.userKey) {
            this.reloadInfo(nextProps.userKey);
        }
    }
    handleCancel() {
        this.props.handleCancel();
    }
    //添加好友
    handleAdd(value) {
        var self = this;

        window.orgManager.addFriend({ Key: value }).done(function (result) {
            self.state.userInfo.IsFriend = "1";
            self.setState({ userInfo: self.state.userInfo });
        }).fail(function () {

        })
    }
    //解除好友
    handleRemove(value) {
        var self = this;

        window.orgManager.removeFriend({ Key: value }).done(function (result) {
            self.state.userInfo.IsFriend = "2";
            self.setState({ userInfo: self.state.userInfo });
        }).fail(function () {

        })
    }

    render() {
        return (
            <Modal wrapClassName="personForm" title="" visible={this.props.visible}
                onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                footer={[
                    this.state.userInfo.IsFriend == "0" ? "" :
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                            发消息
                    </Button>,
                ]}
                >
                <Spin spinning={this.state.loading} tip="努力获取信息...">
                    <div className="titleDiv">
                        <HeadImg className="img" userKey={this.props.userKey} />
                        {this.state.userInfo.IsFriend == "0" ? "" : this.state.userInfo.IsFriend == "1" ?
                            <Button onClick={this.handleRemove.bind(this, this.props.userKey)} className="addDiv" >解除好友</Button> :
                            <Button onClick={this.handleAdd.bind(this, this.props.userKey)} className="addDiv" >添加好友</Button>}

                    </div>
                    <div className="orgDiv">{this.state.userInfo.OrgName}</div>
                    <div className="contentDiv">
                        <div className="contentDivRow"><span className="lable">姓名</span>  <span className="text">{this.state.userInfo.Name}</span></div>
                        <div className="contentDivRow"><span className="lable">手机</span>  <span className="text">{this.state.userInfo.Phone}</span></div>
                        <div className="contentDivRow"><span className="lable">电话</span>  <span className="text">{this.state.userInfo.Tel}</span></div>
                        <div className="contentDivRow"><span className="lable">警号</span>  <span className="text">{this.state.userInfo.No}</span></div>
                        <div className="contentDivRow"><span className="lable">职位</span>  <span className="text">{this.state.userInfo.JobTitle}</span></div>
                        <div className="contentDivRow"><span className="lable">邮箱</span>  <span className="text">{this.state.userInfo.Email}</span></div>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
PersonForm.propTypes = {};
PersonForm.defaultProps = {
    handleCancel: function () { },
    visible: false,
    userKey: ""  //点击用户key
};