import React, { Component } from 'react';
import { Select, Icon, Menu, Breadcrumb } from 'antd';

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
import './orgForm.less';
import HeadImg from '../publicModule/headImg.js'

export default class OrgForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    crumb() {
        if (this.props.friendType == "") {
            return this.props.orgListData.map(function (item, index) {
                if (this.props.orgListData.length - 1 == index) {
                    return (<span key={item.Code} className="endNav">{item.Name}</span>);
                }
                else {
                    var _item = {}
                    _item.key = item.Code;
                    return (<span key={"crumb" + index}><a className="listNav" onClick={this.props.onNextLevel.bind(this, _item)}>{item.Name}</a><span className="spSpan" >{">"}</span></span>);
                }
            }.bind(this));
        }
        else if (this.props.friendType == "Friends" && this.props.friendKey == "") {
            return (<span className="endNav">我的好友</span>);
        } else if (this.props.friendType == "Group") {
            return (<span className="endNav">我的群组</span>);
        }
    }
    orgList() {
        if (this.props.listData.length == 0) {
            return <div className="nofrienddiv">
                没有查询到记录
            </div>
        }
        else {
            var tmpSelectData = [];
            var tmpGroupUser = [];

            for (var i = 0; i < this.props.selectData.length; i++) {
                tmpSelectData[this.props.selectData[i].key] = true;
            }
            for (var i = 0; i < this.props.groupUser.length; i++) {
                tmpGroupUser[this.props.groupUser[i].key] = true;
            }
            return this.props.listData.map(function (item, index) {
                if (item.Type == "1") { //如果是人
                    var _item = {}
                    _item.key = item.UserKey;
                    _item.Name = item.Name;
                    _item.Type = "1";
                    if (tmpGroupUser[_item.key]) {
                        return (<div className="nav-list" key={_item.key}>
                            <div className="select"><Icon type="check" /></div>
                            <HeadImg className="img" userKey={item.UserKey} />
                            <span>{item.Name}</span>
                        </div>);
                    }
                    else {
                        return (<div onClick={this.props.onOpenUser.bind(this, _item)} className="nav-list" key={_item.key}>
                            {tmpSelectData[_item.key] ? <div className="select"><Icon type="check" /></div> : ""}
                            <HeadImg className="img" userKey={item.UserKey} />
                            <span>{item.Name}</span>
                        </div>);
                    }
                }
                else if (item.Type == "2") { //如果是部门
                    var _item = {}
                    _item.key = item.UserKey;
                    return (<div onClick={this.props.onNextLevel.bind(this, _item)} className={this.props.friendKey == "" ? "nav-list listOrg" : "nav-list listOrg online"} >
                        <span>{item.Name}</span> <span className="bmrssp">{item.Info}</span></div>);
                }
                else if (item.Type == "3") { //如果是群组  openGroupHandle
                    var _item = {}
                    _item.key = item.UserKey;
                    _item.Type = "3";
                    return (<div className="nav-list listGroup" onClick={this.props.onOpenUser.bind(this, _item)}>
                        <div>
                            <HeadImg className="groupImg" userKey={item.UserKey} type={"2"} />
                        </div>
                        <div className="groupSpan">
                            <span>{item.Name}</span>
                            <span>{item.Info}</span>
                        </div>
                    </div>);
                }
            }.bind(this));
        }

    }
    render() {
        return (<div className="OrgForm">
            {this.props.friendKey == "" && this.props.friendType != "" ? <div className="navDiv online">{this.crumb()}</div> :
                this.props.friendType == "" ? <div className="navDiv">{this.crumb()}</div> : ""}

            <div className="list">
                {this.orgList()}
            </div>
        </div>);
    }
}
OrgForm.propTypes = {};
OrgForm.defaultProps = {
    listData: [],  //数据列表
    orgListData: [], // 面包屑 
    friendType: "", //Friends好友 Group群组
    onNextLevel: function (value) { },
    onOpenUser: function (value) { },
    selectData: [],  //长度不等于0时是群组
    groupUser: [],//已选群组人数
    friendKey: ""  //点击好友+创建群组。不为空时是群组
};
