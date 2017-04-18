import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon, Button, Tooltip, Modal, Spin } from 'antd';

import "./groupMainUserChange.less"

import HeadImg from '../publicModule/headImg.js';
import Util from '../../mod/util/util.js'

export default class GroupMainUserChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectUser: null //已经读取的列表
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
            // this.setState({ loadding: true });
            // window.orgManager.editGroupMainUserForGroupKey({ Key: nextProps.msgInfo.Key })
            //     .done(function (result) {
            //         this.setState({ loadding: false, readList: result });
            //     }.bind(this));
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
    handleSelectUser(item) {
        console.log(item);
        if (this.state.selectUser != null) {
            if (this.state.selectUser.Key == item.Key) {
                this.state.selectUser = null;
                this.setState({ selectUser: this.state.selectUser });
                return;
            }
        }
        this.state.selectUser = item;
        this.setState({ selectUser: this.state.selectUser });
    }
    renderList(list) {
        return list.map(function (item, index) {
            if (item.UserKey == window.LoginUser.Key)
                return "";
            return (<div className="one" onClick={this.handleSelectUser.bind(this, item)}>
                <div className="userImg">
                    {this.state.selectUser != null && this.state.selectUser.Key == item.Key ? <div className="select"><Icon type="check" /></div> : ""}
                    <HeadImg className="img" userKey={item.UserKey} />
                </div>
                <div className="name">
                    <span>{item.UserName}</span>
                </div>
            </div>);
        }.bind(this));
    }
    onOK() {
        window.orgManager.editGroupMainUserForGroupKey({ GroupKey: this.props.groupInfo.Key, NewMainUserKey: this.state.selectUser.UserKey })
            .done(function (result) {
                this.setState({ selectUser: null });
                this.props.closePanel();
            }.bind(this));

    }
    closePanel() {
        this.setState({ selectUser: null });
        this.props.closePanel();
    }
    render() {
        return (<Modal wrapClassName="groupMainUserChange" width={445} title="请选择新的群主" visible={this.props.visible}
            onCancel={this.closePanel.bind(this)}
            footer={[
                <Button key="esc" onClick={this.closePanel.bind(this)}>
                    取消
                    </Button>,
                <Button key="submit" type="primary" disabled={this.state.selectUser == null} onClick={this.onOK.bind(this)}>
                    确定
                    </Button>
            ]}>
            <div className="panel">
                {this.renderList(this.props.groupUserList)}
            </div>
        </Modal >);
    }
}
GroupMainUserChange.propTypes = {};
GroupMainUserChange.defaultProps = {
    groupInfo: {},
    groupUserList: [],
    visible: false,
    closePanel: function () { }
};