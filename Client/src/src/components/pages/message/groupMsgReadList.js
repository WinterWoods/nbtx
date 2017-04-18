import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon, Button, Tooltip, Modal, Spin } from 'antd';

import "./groupMsgReadList.less"

import HeadImg from '../publicModule/headImg.js';
import Util from '../../mod/util/util.js'

export default class GroupMsgReadList extends Component {
    constructor(props) {
        super(props);
        this.readListFlag = {};
        this.state = {
            loadding: false, //加载窗体
            readList: [] //已经读取的列表
        }
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行


    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.setState({ loadding: true });
            window.msgManager.groupMsgReadUserList({ Key: nextProps.msgInfo.Key })
                .done(function (result) {
                    this.setState({ loadding: false, readList: result });
                }.bind(this));
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
    handleOk() {
    }
    renderNoReadList(list) {
        return list.map(function (item, index) {
            if (this.readListFlag[item.UserKey] || item.UserKey == window.LoginUser.Key)
                return "";
            return (<div className="one">
                <div className="userImg">
                    <HeadImg className="img" userKey={item.UserKey} />
                </div>
                <div className="name">
                    <span>{item.UserName}</span>
                </div>
            </div>);
        }.bind(this));
    }
    renderReadList(list) {
        return list.map(function (item, index) {
            this.readListFlag[item.UserKey] = true;
            return (<div className="one">
                <div className="userImg">
                    <HeadImg className="img" userKey={item.UserKey} />
                </div>
                <div className="name">
                    <span>{this.props.groupNameGet(item.UserKey)}</span>
                </div>
            </div>);
        }.bind(this));
    }
    renderData() {
        this.readListFlag = {};
        var readList = this.renderReadList(this.state.readList)
        return (<div className="panel">
            {this.props.groupUserList.length - 1 - this.state.readList.length == 0 ? "" :
                <div className="context">
                    <div className="title">
                        未读 ({this.props.groupUserList.length - 1 - this.state.readList.length})
                    </div>
                    <div className="list">
                        {this.renderNoReadList(this.props.groupUserList)}
                    </div>
                </div>
            }
            {this.state.readList.length == 0 ? "" :
                <div className="context">
                    <div className="title">
                        已读 ({this.state.readList.length})
                    </div>
                    <div className="list">
                        {readList}
                    </div>
                </div>}
        </div>);
    }
    renderPanel() {
        if (this.state.loadding) {
            return (<div className="loaddingPanel">
                <Spin />
            </div>);
        }
        else {
            return this.renderData();
        }
    }
    render() {
        return (<Modal wrapClassName="groupMsgReadList" width={445} title="消息接收人列表" visible={this.props.visible}
            onOk={this.props.closePanel.bind(this)} onCancel={this.props.closePanel.bind(this)}
            footer={[
                <Button key="submit" type="primary" onClick={this.props.closePanel.bind(this)}>
                    确定
                    </Button>,
            ]}>
            {this.renderPanel()}
        </Modal >);
    }
}
GroupMsgReadList.propTypes = {};
GroupMsgReadList.defaultProps = {
    groupInfo: {},
    msgInfo: {},
    groupUserList: [],
    visible: false,
    groupNameGet: function (key) { },
    closePanel: function () { }
};