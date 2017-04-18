import React, { Component } from 'react';
import { Modal, Button, Select, Tabs, Spin, Input } from 'antd';

import './GroupForm.less';
import { hashHistory } from 'react-router'
const TabPane = Tabs.TabPane;
const Option = Select.Option;

import HeadImg from '../publicModule/headImg.js';
import OrgForm from '../orgManager/OrgForm.js'

export default class GroupForm extends Component {
    constructor(props) {
        super(props);
        this.cacheUserList = {};
        this.state = {
            OrgUserList: [], //当前部门列表
            TopOrg: {},     //我的顶级部门
            MyOrg: {},      //我的部门
            OrgModel: [],   //面包屑  上级所有部门
            FriendType: "",  //Friends好友 Group群组
            loading: false,
            userNum: 0,  //默认人数
            selectValue: [],  //添加群组 所有人员
            searchList: [],  //列表搜索结果
            activeTab: "",  //当前激活窗体
            groupNewName: ""  //群组名称 
        }
    }
    componentDidMount() {
        var self = this;
        self.setState({ loading: true });
        this.reCacheUserList(this.props.groupUser);
        window.orgManager.myOrgList({ OrgCode: "" }).done(function (json) {
            self.setState({ OrgUserList: json.OrgUserList, TopOrg: json.TopOrg, MyOrg: json.MyOrg, OrgModel: json.OrgModel, FriendType: "" });
        }).always(function () {
            self.setState({ loading: false, activeTab: self.state.TopOrg.Code });
        })
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        if (this.props != nextProps) {
            this.reCacheUserList(nextProps.groupUser);
        }
    }
    reCacheUserList(list) {
        this.cacheUserList = {};
        for (var i = 0; i < list.length; i++) {
            this.cacheUserList[list[i].key] = true;
        }
    }
    handleOk() {
        //确定  
        var self = this;
        var userArray = [];

        var gName = self.state.groupNewName;
        var gKey = "";
        if (self.props.groupIsExist) //如果群组存在 
        {
            gName = self.props.groupName;
            gKey = self.props.friendKey;
        }
        else {
            userArray.push(window.LoginUser.Key);
            userArray.push(self.props.friendKey);
        }

        for (var i = 0; i < self.state.selectValue.length; i++) {
            userArray.push(self.state.selectValue[i].key);
        }

        window.orgManager.addGroup({ Name: gName, KeyList: userArray.join(','), Key: gKey }).done(function (json) {
            console.log("qunzu", json);
            self.props.handleCancel();
            window.OftenListAdd(json.Key, "2");
        }).always(function () {
            self.setState({ saveLoading: false });
        });
    }
    handleCancel() {
        this.tabChange(this.state.TopOrg.Code);
        this.setState({ loading: false, userNum: 0, selectValue: [], searchList: [], activeTab: this.state.TopOrg.Code, groupNewName: this.props.groupName });
        this.props.handleCancel();
    }
    nextLevelHandle(value) { //点击下一级或者面包屑触发事件  
        var self = this;
        if (value.key) {
            self.setState({ loading: true });
            window.orgManager.myOrgList({ OrgCode: value.key }).done(function (json) {
                self.setState({ OrgUserList: json.OrgUserList, OrgModel: json.OrgModel, FriendType: "" });
            }).always(function () {
                self.setState({ loading: false });
            })
        }
    }
    openUserHandle(value) {  //点击人选中事件
        for (var i = 0; i < this.state.selectValue.length; i++) {
            var element = this.state.selectValue[i];
            if (element.key == value.key) {
                //去掉现有的
                this.state.selectValue.splice(i, 1);
                this.setState({ selectValue: this.state.selectValue, userNum: this.state.selectValue.length });
                //告诉下边不用在添加
                return;
            }
        }
        //如果不存在，就添加上
        this.state.selectValue.push({ key: value.key, label: value.Name });
        this.setState({ selectValue: this.state.selectValue, userNum: this.state.selectValue.length });
    }

    handleChange(value) {
        this.setState({ selectValue: value, userNum: value.length });
    }
    handleSearch(value) {
        var self = this;
        if (value != "") {
            window.orgManager.search({ value: value })
                .done(function (result) {
                    self.setState({ searchList: result });
                })
        }
    }
    renderSelectValue() {
        return this.state.searchList.map(function (item, index) {
            return <option key={item.Key} value={item.Key} label={item.Name} disabled={this.cacheUserList[item.Key]}>
                <div className="searchUserOption">
                    <div className="headImg">
                        <HeadImg className="img" userKey={item.Key} />
                    </div>
                    <div className="userInfo">
                        <div className="name">
                            {item.Name}
                        </div>
                        <div className="unit">
                            {item.Info}
                        </div>
                    </div>
                </div>
            </option>;
        }.bind(this))
    }
    tabChange(value) {
        var self = this;
        if (value == "friendsTab") {
            self.setState({ loading: true });

            window.orgManager.friendList().done(function (json) {
                self.setState({ OrgUserList: json, OrgModel: [], FriendType: "Friends" });
            }).always(function () {
                self.setState({ loading: false, activeTab: value });
            })
        }
        else {
            self.setState({ loading: true });
            window.orgManager.myOrgList({ OrgCode: "" }).done(function (json) {
                self.setState({ OrgUserList: json.OrgUserList, TopOrg: json.TopOrg, MyOrg: json.MyOrg, OrgModel: json.OrgModel, FriendType: "" });
            }).always(function () {
                self.setState({ loading: false, activeTab: value });
            })
        }
    }
    handleChangeGroup(e) {
        var self = this;
        if (e.target.value.length != 0) {
            self.setState({ groupNewName: e.target.value });
        }
    }
    render() {
        return (<div >
            <Modal wrapClassName="groupForm" width={679} style={{ top: 30, }} title="添加新成员" visible={this.props.visible}
                onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                footer={[
                    <Button key="submit" type="primary" disabled={this.state.userNum == 0} onClick={this.handleOk.bind(this)}>
                        确定
                    </Button>,
                ]}
                >
                <div className="contentDiv">
                    <div className="leftgroup">
                        <div className="lefttitle">
                            <span className="span1">新添成员: </span>
                            <span className="span2">已选 {this.state.userNum + this.props.groupUser.length}/ 100 人</span>
                        </div>
                        <div className="leftDiv" id="area">
                            <div className="selectDiv">
                                <Select multiple labelInValue notFoundContent=""
                                    style={{ width: '382' }} getPopupContainer={() => document.getElementById('area')}
                                    notFoundContent=""
                                    placeholder="搜索名字、拼音..."
                                    onChange={this.handleChange.bind(this)}
                                    onSearch={this.handleSearch.bind(this)}
                                    value={this.state.selectValue}
                                    filterOption={false}
                                    size={"large"}
                                    optionLabelProp={"label"}
                                    >
                                    {this.renderSelectValue()}
                                </Select>
                            </div>
                            <p className="pname">群名称：</p>
                            <Input placeholder="群名称"
                                disabled={this.props.groupIsExist} value={this.props.groupIsExist ? this.props.groupName : this.state.groupNewName} onChange={this.handleChangeGroup.bind(this)} />
                        </div>
                    </div>
                    <div className="rightgroup">
                        <span className="span3">选择联系人: </span>
                        <div className="card-container">
                            <Spin spinning={this.state.loading}>
                                <Tabs type="card"
                                    activeKey={this.state.activeTab}
                                    onChange={this.tabChange.bind(this)}>
                                    <TabPane tab={this.state.TopOrg.Name} key={this.state.TopOrg.Code}>
                                        <OrgForm
                                            listData={this.state.OrgUserList}
                                            orgListData={this.state.OrgModel}
                                            friendType={this.state.FriendType}
                                            selectData={this.state.selectValue}
                                            onNextLevel={this.nextLevelHandle.bind(this)}
                                            friendKey={this.props.friendKey}
                                            groupUser={this.props.groupUser}
                                            onOpenUser={this.openUserHandle.bind(this)} />
                                    </TabPane>
                                    <TabPane tab="好友" key="friendsTab">
                                        <OrgForm
                                            listData={this.state.OrgUserList}
                                            orgListData={this.state.OrgModel}
                                            friendType={this.state.FriendType}
                                            selectData={this.state.selectValue}
                                            onNextLevel={this.nextLevelHandle.bind(this)}
                                            friendKey={this.props.friendKey}
                                            groupUser={this.props.groupUser}
                                            onOpenUser={this.openUserHandle.bind(this)} />
                                    </TabPane>
                                </Tabs>
                            </Spin >
                        </div>
                    </div>
                </div>
            </Modal>
        </div>);
    }
}
GroupForm.propTypes = {};
GroupForm.defaultProps = {
    handleCancel: function () { },
    friendKey: '',   //群组存在 群组key ；群组不存在，人员key
    groupIsExist: false,  //群组是否存在，如果存在，新增成员
    groupName: "",  //群名称
    groupUser: [],  //群组人员
    visible: false
};