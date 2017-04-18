import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon, Button, Tooltip, Progress, Input, Switch, Modal } from 'antd';
const confirm = Modal.confirm;
import "./groupSetting.less"

import Util from '../../mod/util/util.js'
import HeadImg from '../publicModule/headImg.js';
import GroupMainUserChange from './groupMainUserChange.js';

import PersonForm from '../publicModule/PersonForm.js'

export default class GroupSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personVisible: false,
            userKey: "",
            groupNameSetFlag: false, //群名称设置
            groupName: "", //群名称
            onlyMainManager: false,
            lookLogMsg: false,
            groupMainUserChangeVisible: false

        }
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        this.setState({ onlyMainManager: nextProps.groupInfo.OnlyMainManager, groupName: nextProps.groupInfo.GroupName, lookLogMsg: nextProps.groupInfo.LogMsgLook });
        if (nextProps.visiblePanel == false) {
            this.setState({ groupNameSetFlag: false });
        }
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentDidUpdate(prevProps, prevState) {

    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    openPersonForm(key) {
        this.setState({ userKey: key, personVisible: true });
    }
    removeUser(item) {
        var self = this;
        confirm({
            title: '确认信息',
            content: '是否确认把 ' + item.UserName + ' 移出群？',
            onOk() {
                //删除并关闭，并刷新
                window.orgManager.delteGroupUser({ UserKey: item.UserKey, GroupKey: self.props.groupInfo.Key })
                    .done(function () {
                        self.props.reloadGroupInfo(self.props.groupInfo.Key, self.state.groupName);
                    });
            },
            onCancel() { },
        });
    }
    cancelPersonFormHandle(value) {
        this.setState({ personVisible: false });
    }
    //修改群名称事件
    groupNameEditClick() {
        //一个测试
        // var aaa={};
        // aaa["a1"]="123";
        // console.log(aaa);
        // aaa["a2"]="1234";
        // console.log(aaa);
        // aaa.unshift(aaa["a3"]="5");
        // console.log(aaa);
        this.setState({ groupNameSetFlag: true, groupName: this.props.groupInfo.GroupName });
    }
    addGroupUser() {
        this.props.addGroupUser();
    }
    groupNameSaveClick() {
        window.orgManager.editGroupNameForGroupKey({ Name: this.state.groupName, GroupKey: this.props.groupInfo.Key })
            .done(function () {
                this.props.reloadGroupInfo(this.props.groupInfo.Key, this.state.groupName);
                this.setState({ groupNameSetFlag: false });
            }.bind(this));

    }
    handleOnlyMainManager() {
        window.orgManager.editGroupOnlyManagerForKey({ flag: !this.state.onlyMainManager, GroupKey: this.props.groupInfo.Key })
            .done(function () {
                this.props.reloadGroupInfo(this.props.groupInfo.Key, this.state.groupName);
            }.bind(this));
    }
    handleLookLogMsg() {
        window.orgManager.editGroupLookLogMsg({ flag: !this.state.lookLogMsg, GroupKey: this.props.groupInfo.Key })
            .done(function () {
                this.props.reloadGroupInfo(this.props.groupInfo.Key, this.state.groupName);
            }.bind(this));


    }
    exitGroup() {
        var self = this;
        confirm({
            title: '确认信息',
            content: '是否确认退出群聊？',
            onOk() {
                //删除并关闭，并刷新
                window.orgManager.exitGroup({ Key: self.props.groupInfo.Key })
                    .done(function () {
                        //如果推出群，需要更新自己本地
                        window.deleteOftenList(self.props.groupInfo.Key);
                    });
            },
            onCancel() { },
        });

    }
    delGroup() {
        var self = this;
        confirm({
            title: '确认信息',
            content: '解散该群后，所有群成员将失去和群友的联系。',
            onOk() {
                //删除并关闭，并刷新
                window.orgManager.delGroup({ Key: self.props.groupInfo.Key })
                    .done(function () {
                        window.deleteOftenList(self.props.groupInfo.Key);
                        //如果推出群，需要更新自己本地
                    });
            },
            onCancel() { },
        });

    }
    changeMainUser() {
        this.setState({ groupMainUserChangeVisible: true });
    }
    changeMainUserClosePanel() {
        this.setState({ groupMainUserChangeVisible: false });
    }
    renderGroupPersonList() {
        return this.props.groupUserList.map(function (item, index) {
            return (<div className="onePerson">
                <div className="imgPanel">
                    <a className="imga" onClick={this.openPersonForm.bind(this, item.UserKey)} >
                        <HeadImg className="img" userKey={item.UserKey} />
                    </a>
                    {item.UserKey == window.LoginUser.Key || this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" : <div className="removeBtn">
                        <a className="removea" onClick={this.removeUser.bind(this, item)}>
                            <Icon type="close-circle" />
                        </a>
                    </div>}
                </div>
                <span className="name">{item.UserName}</span>
            </div>);
        }.bind(this));
    }
    render() {
        return (<div className="groupSetting" >
            <div className="contextPanel">
                <div className="one">
                    <div className="label">
                        群名称：
                    </div>
                    <div className="neirong">
                        {this.state.groupNameSetFlag ?
                            <div className="edit">
                                <Input placeholder="请输入新的群组名称" value={this.state.groupName} onChange={(value) => this.setState({ groupName: value.target.value })} />
                                <Button type="primary" onClick={this.groupNameSaveClick.bind(this)}>确定</Button>
                            </div>
                            : <div className="display"><div className="text">{this.props.groupInfo.GroupName}</div>
                                {this.props.groupInfo.OnlyMainManager && this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" : <a onClick={this.groupNameEditClick.bind(this)}> <Icon type="edit" />编辑</a>}</div>
                        }
                    </div>
                </div>
                {
                    this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" :
                        <div className="one">
                            <div className="label">
                                <Tooltip title="修改群名称,添加群成员,编辑群公告"><span>仅群主可管理：</span></Tooltip>
                            </div>
                            <div className="neirong right">
                                {this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" : <Switch checked={this.state.onlyMainManager} onChange={this.handleOnlyMainManager.bind(this)} />}
                            </div>
                        </div>
                }

                <div className="one">
                    <div className="label">
                        群主：
                    </div>
                    <div className="neirong">
                        <div className="text">{this.props.groupNameGet(this.props.groupInfo.GroupMainKey)}</div>
                        {this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" : < a onClick={this.changeMainUser.bind(this)}> <Icon type="swap" />转让群主</a>}
                    </div>
                </div>
                {this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" :
                    < div className="one" >
                        <div className="label">
                            <Tooltip title="新添加的成员可以查看历史聊天记录"><span>新成员可查看聊天历史：</span></Tooltip>
                        </div>
                        <div className="neirong right">
                            <Switch checked={this.state.lookLogMsg} onChange={this.handleLookLogMsg.bind(this)} />
                        </div>
                    </div>}
                <div className="one">
                    <div className="label">
                        群成员：
                    </div>
                    <div className="neirong">
                        <div className="text">{this.props.groupInfo.NowCount}人</div>
                        {this.props.groupInfo.OnlyMainManager && this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" : <a onClick={this.addGroupUser.bind(this)}> <Icon type="plus" />添加新成员</a>}
                    </div>
                </div>
                {this.props.groupInfo.GroupMainKey != window.LoginUser.Key && this.props.groupInfo.LogMsgLook ? <div className="lookMsgInfo">
                    群主已开启“新成员查看聊天记录“
                </div> : ""
                }
                <div className="groupPersonList">
                    {this.renderGroupPersonList()}
                </div>
            </div>
            <div className="btnOpts">
                <div className="btnOpt">

                </div>
                <div className="btnOpt">
                    <Button type="primary" size="large" onClick={this.exitGroup.bind(this)}>退出该群</Button>
                </div>
                <div className="btnOpt exitGroup">
                    {this.props.groupInfo.GroupMainKey == window.LoginUser.Key ? <a onClick={this.delGroup.bind(this)}><Icon type="right-square-o" /> 解散群聊</a> : ""}
                </div>
            </div>
            <PersonForm
                visible={this.state.personVisible}
                userKey={this.state.userKey}
                handleCancel={this.cancelPersonFormHandle.bind(this)} />
            <GroupMainUserChange
                groupInfo={this.props.groupInfo}
                groupUserList={this.props.groupUserList}
                visible={this.state.groupMainUserChangeVisible}
                closePanel={this.changeMainUserClosePanel.bind(this)}
                />
        </div >);
    }
}
GroupSetting.propTypes = {};
GroupSetting.defaultProps = {
    groupInfo: {},
    visiblePanel: false,
    groupUserList: [],
    groupUserAllName: {},
    reloadGroupInfo: function (key, name) { },
    addGroupUser: function () { },
    groupNameGet: function (key) { }
};