import React, { Component } from 'react';
import { Form, Tabs, Select, Menu, Icon, Spin } from 'antd';

const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
import './orgManager.less';

import { hashHistory } from 'react-router'
import OrgForm from './OrgForm.js'
import PersonForm from '../publicModule/PersonForm.js'


export default class OrgManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OrgUserList: [], //当前部门列表
      TopOrg: {},     //我的顶级部门
      MyOrg: {},      //我的部门
      OrgModel: [],   //面包屑  上级所有部门
      selectKey: "",   //当前选中部门key 
      FriendList: [], //好友(群组)列表
      FriendType: "", //Friends好友 Group群组 ""列表
      personVisible: false,  //是否显示弹窗 
      FriendVisible: "none", //是否显示好友(群组)列表
      userKey: "",   //点击用户key
      friendState: "", //好友状态 0自己 1好友 2非好友
      loading: false
    }
  }
  componentDidMount() {
    //第一次进来进行渲染  返回我的部门信息，我的顶级部门信息 部门列表 我的部门包含的下级部门和所有人
    var self = this;
    self.setState({ loading: true });
    window.orgManager.myOrgList({ OrgCode: "" }).done(function (json) {
      self.setState({ OrgUserList: json.OrgUserList, TopOrg: json.TopOrg, MyOrg: json.MyOrg, OrgModel: json.OrgModel, selectKey: json.MyOrg.Code, FriendType: "" });
    }).always(function () {
      self.setState({ loading: false });
    })
  }
  componentWillUnmount() {
    //准备卸载前执行
  }
  nextLevelHandle(value) {   //点击下一级或者面包屑触发事件  
    var self = this;
    if (value.key == "Friends") {
      window.orgManager.friendList().done(function (json) {
        self.setState({ OrgUserList: json, OrgModel: [], FriendType: value.key, selectKey: value.key });
      })
    }
    else if (value.key == "Group") {

      window.orgManager.groupList().done(function (json) {
        self.setState({ OrgUserList: json, OrgModel: [], FriendType: value.key, selectKey: value.key });
      })
    }
    else if (value.key) {
      self.setState({ loading: true });
      window.orgManager.myOrgList({ OrgCode: value.key }).done(function (json) {
        self.setState({ OrgUserList: json.OrgUserList, OrgModel: json.OrgModel, selectKey: value.key, FriendType: "" });
      }).always(function () {
        self.setState({ loading: false });
      })
    }
  }
  openUserHandle(value) {
    var self = this;
    if (value.Type == "1") {  //点击人触发

      self.setState({ personVisible: true, userKey: value.key });
    }
    else if (value.Type == "3") {  //点击群组触发事件  
      window.OftenListAdd(value.key, "2");
      // window.msgManager.myOftenListAdd({ FriendKey: value.key, Type: "2" })
      //   .done(function (result) {
      //     for (var i = 0; i < window.oftens.length; i++) {
      //       if (window.oftens[i].Key == result.Key) {
      //         window.oftens.splice(i, 1);
      //         break;
      //       }
      //     }
      //     window.oftens.splice(0, 0, result);
      //     hashHistory.replace(window.defaultSelectedKey);
      //   });
    }
  }
  cancelHandle(value) {
    this.setState({ personVisible: false });
  }
  render() {
    return (<div className="notification">
      <div className="listMenu">
        <Spin spinning={this.state.loading}>
          <Menu onClick={this.nextLevelHandle.bind(this)}
            defaultOpenKeys={['Org']}
            selectedKeys={[this.state.selectKey]}
            mode="inline"
            >
            <SubMenu key="Org" className="starOrg" title={<span><Icon type="team" /><span>{this.state.TopOrg.Name}</span></span>}>
              <Menu.Item key={this.state.TopOrg.Code}>组织结构</Menu.Item>
              <Menu.Item key={this.state.MyOrg.Code}>部门</Menu.Item>
            </SubMenu>
            <Menu.Item key="Friends">
              <span><Icon type="user" />
                <span className="nav-text">我的好友</span></span>
            </Menu.Item>
            <Menu.Item key="Group">
              <span><Icon type="team" />
                <span className="nav-text">我的群组</span></span>
            </Menu.Item>
          </Menu>
        </Spin >
      </div>
      <div className="content">
        <OrgForm
          listData={this.state.OrgUserList}
          orgListData={this.state.OrgModel}
          friendType={this.state.FriendType}
          onNextLevel={this.nextLevelHandle.bind(this)}
          onOpenUser={this.openUserHandle.bind(this)} />
      </div>
      <PersonForm
        visible={this.state.personVisible}
        userKey={this.state.userKey}
        friendState={this.state.friendState}
        handleCancel={this.cancelHandle.bind(this)} />
    </div>);
  }
}

