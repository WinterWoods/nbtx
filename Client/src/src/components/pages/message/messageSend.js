import React, { Component } from 'react';
import { Menu, Breadcrumb, Icon, Row, Col, message, Tabs, Dropdown, Form, Spin, Badge, Input, Button, Tooltip, Popover, Upload, Modal, Mention } from 'antd';
const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;

import './messageSend.less';
import Util from '../../mod/util/util.js'
import SendPic from './sendPic.js'
import GroupForm from './GroupForm.js'
import PersonForm from '../publicModule/PersonForm.js'

import FaceSelect from './faceSelect.js';
import HeadImg from '../publicModule/headImg.js';
import FileList from './fileList.js';
import ModalPanel from './modalPanel.js'
import GroupSetting from './groupSetting.js';
import Brief from './brief.js';
import GroupMsgReadList from './groupMsgReadList.js';
import FaceList from "../../mod/util/faceList.js";

export default class MessageSend extends Component {
    constructor(props) {
        super(props);
        this.PageSize = 20; //加载消息每次加载数量
        this.isbuttom = false;
        this.befMessage = null;
        this.isHaveMoreMsgList = false;
        this.arrIsReadList = [];
        this.state = {
            message: "", //文本框中的内容
            messageListResult: [], //消息记录
            popoverVisible: false,
            sendFileModal: false, //发送文件窗体
            originFileObj: {}, //文件数据
            sendFileSrc: "", // 用于发送文件的路径
            groupVisible: false,  //群组弹窗
            groupUserKey: "",  //点击用户添加群组
            groupIsExist: false, //群组是否已经存在
            groupName: "", //群名称
            groupUser: [], //默认已选群组人数 
            personVisible: false,  //是否显示弹窗  
            userKey: "",   //点击用户key,用于显示用户弹窗的
            msgLoading: false, //消息加载中
            msgNotHaveMore: false, //消息没有更多
            msgLoadMore: false,//消息更多记录
            arrIsReadSendList: [], //消息已经读取列表
            fileListVisible: false, //文件列表状态,是否显示
            groupSettingVisible: false, //群设置
            groupInfo: {},//本页面的群组消息
            groupUserList: [], //群组中的用户列表701
            groupAllUser: {}, //群用户所有列表。包含曾经退出的，用来渲染名字
            userInfo: {}, //本页面用户信息
            groupBriefVisible: false, //群公告,是否显示
            groupMsgReadListVisible: false, //群聊,是否已读窗口
            groupMsgReadListMsgInfo: {} //查询群聊是否未读,点击那条的信息
        }
    }
    componentDidMount() {
        var self = this;
        console.log("准备执行componentDidMount");
        this.reloadMsg(this.props.oftenInfo,this.props.noReadMessageCount);

        this.reloadGroupInfo(this.props.oftenInfo);
        window.clientHub.msgReadedList = function (result) {
            if (result.Type == "1") {
                //如果是个人聊天
                self.state.arrIsReadSendList[result.Key] = true;
            }
            else {
                //如果是群聊
                self.state.arrIsReadSendList[result.Key] = result.ReadPersonCount;
            }

            self.setState({ arrIsReadSendList: self.state.arrIsReadSendList });
        };
        window.clientHub.reloadGroupInfo = function (result) {
            //如果有人修改自己有的群组信息会推送过来。
            //如果本地显示的 群聊等于这个则修改

            if (self.props.oftenInfo.FriendKey == result.Key) {
                self.reloadGroupInfo({ FriendKey: result.Key });
            }

            //如果修改了不允许查看历史聊天记录. 则需要从新刷新聊天记录
            if (self.state.groupInfo.LogMsgLook != result.LogMsgLook) {
                self.reloadMsg({ FriendKey: result.Key });
            }
        };
        nw.Window.get().on('blur', function () {
            console.log("messageSend页面后台");
            window.winIsFocus = false;
        });
        nw.Window.get().on('focus', function () {
            console.log("messageSend页面激活");
            window.winIsFocus = true;
            self.isRead();
        });
        window.messageDiv = self.refs.messageDiv;
        window.deleteMsg = function (key) {
            for (var i = 0; i < self.state.messageListResult.length; i++) {
                if (self.state.messageListResult[i].Key == key) {
                    self.state.messageListResult.splice(i, 1);
                    break;
                }
            }
        }.bind(this)

        //截图快捷键
        var copyOption = {
            key: window.userConfig.CopySc
        };

        // Create a shortcut with |option|.
        window.copyShortcut = new nw.Shortcut(copyOption);

        // Register global desktop shortcut, which can work without focus.
        nw.App.registerGlobalHotKey(window.copyShortcut);

        // If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
        // will get an "active" event.

        // You can also add listener to shortcut's active and failed event.
        window.copyShortcut.on('active', function () {
            self.scrSpyHandle();
        });

        window.copyShortcut.on('failed', function (msg) {
        });
    }
    reloadGroupInfo(oftenInfo) {
        if (oftenInfo.Type == "1")
            return;
        //群组
        var self = this;
        window.orgManager.getGroupInfoForGroupKey({ Key: oftenInfo.FriendKey })
            .done(result => {
                window.oftensEditName(result.Key, result.GroupName);
                self.setState({ groupInfo: result });
            });
        //获取当前聊天框中的人员
        window.orgManager.getGroupUsersFormGroupKey({ Key: oftenInfo.FriendKey })
            .done(result => {
                self.setState({ groupUserList: result });
            });
        window.orgManager.getGroupUsersHaveExitUserFormGroupKey({ Key: oftenInfo.FriendKey })
            .done(result => {
                for (var i = 0; i < result.length; i++) {
                    self.state.groupAllUser[result[i].UserKey] = result[i];
                }
                self.state.groupAllUser.length = result.length;
                self.setState({ groupAllUser: self.state.groupAllUser });
            });
    }
    reloadMsg(oftenInfo,noReadMessageCount) {
        var self = this;
        //获取过去消息列表
        self.setState({ msgNotHaveMore: false, msgLoading: true, msgLoadMore: false });
        //如果是群组拉去群组信息，并拉去群组成员
        if (oftenInfo.Type == "1") {
            //个人
            //如果是个人拉去个人信息
            window.orgManager.userInfo({ UserKey: oftenInfo.FriendKey })
                .done(result => {
                    self.setState({ userInfo: result });
                });
        }
        var timestamp = new Date().getTime();
        window.msgManager.messageList({ SendKey: oftenInfo.FriendKey, Type: oftenInfo.Type, PageSize:noReadMessageCount!=null&&noReadMessageCount!=0?noReadMessageCount:this.PageSize, RandomString: timestamp })
            .done(result1 => {
                //如果不是上次请求直接丢掉
                if (result1.RandomString != timestamp) {
                    self.setState({ messageListResult: [], msgNotHaveMore: false, msgLoading: false, msgLoadMore: false });
                    return;
                }
                if (result1.length == 0) {
                    self.isHaveMoreMsgList = true;
                    self.setState({ msgNotHaveMore: true, msgLoading: false, msgLoadMore: false });
                }
                else {
                    if (oftenInfo.Type == "1") {
                        self.setState({ messageListResult: result1.data, msgNotHaveMore: false, msgLoading: false, msgLoadMore: false });
                        self.refs.messageDiv.scrollTop = self.refs.messageDiv.scrollHeight;
                    }
                    else {
                        var timer__ = setInterval(function () {
                            if (self.state.groupUserList.length > 0) {
                                clearInterval(timer__);
                                timer__ = null;
                                self.setState({ messageListResult: result1.data, msgNotHaveMore: false, msgLoading: false, msgLoadMore: false });
                                self.refs.messageDiv.scrollTop = self.refs.messageDiv.scrollHeight;

                            }
                        }, 200);
                    }
                }
            });
        //有key的时候才去清除
        if (oftenInfo.Key)
            window.msgManager.myOftenListReadClear({ Key: oftenInfo.Key });
        self.isHaveMoreMsgList = false;

    }
    componentWillReceiveProps(nextProps) {

        //接受到新的数据处理
        var self = this;
        console.log("!!!!!!!!!!!!!!000000000", nextProps.newMessage);
        if (nextProps.newMessage && this.props.newMessage != nextProps.newMessage) {

            //判断滚动条是否在底部。
            self.isbuttom = false;
            if (self.refs.messageDiv.scrollTop > (self.refs.messageDiv.scrollHeight - self.refs.messageDiv.clientHeight - 20)) {
                self.isbuttom = true;
            }
            //接收到新的消息，如果是撤销的话就讲原来的消息替换为新的撤销消息
            var msgList = self.state.messageListResult;
            console.log("!!!!!!!!!!!!!!111111111", nextProps.newMessage);
            if (nextProps.newMessage.MsgType == "9") {
                for (var i = 0; i < msgList.length; i++) {
                    if (msgList[i].Key == nextProps.newMessage.Key) {
                        msgList.splice(i, 1, nextProps.newMessage);
                        break;
                    }
                }
            }
            else {
                //如果是普通消息的话则直接追加进去
                msgList.push(nextProps.newMessage);
            }
            if (msgList.length > 20)
                msgList.splice(0, msgList.length - 20)
            self.setState({ messageListResult: msgList });
        }
        if (this.props.oftenInfo != nextProps.oftenInfo) {
            self.setState({ messageListResult: [], userInfo: {}, groupInfo: {} });
            this.reloadMsg(nextProps.oftenInfo,this.props.noReadMessageCount);
            this.reloadGroupInfo(nextProps.oftenInfo);
            //将草稿信息回传给上一层,并记录
            this.props.draftMsg(this.props.oftenInfo.Key, this.state.message);
            this.setState({ arrIsReadSendList: self.state.arrIsReadSendList, message: nextProps.oftenInfo.draftText });
            this.arrIsReadList = [];
        }
    }
    isRead() {
        var self = this;
        if (window.winIsFocus) {
            for (var dom in this.refs) {
                var key = dom;
                if (this.refs[key].getAttribute("data-type") != "msgRead")
                    continue;

                if (this.arrIsReadList[key])
                    continue;
                var a = this.refs.messageDiv.scrollTop - this.refs[key].offsetTop + this.refs[key].clientHeight;
                if (a < 0) {
                    //出现在聊天窗口中,说明人可以看见
                    this.arrIsReadList[key] = true;
                    //发送给后台,告诉后台这个已经读取了.
                    window.msgManager.msgReaded({ Key: key + "" });

                }
                //获取div距离顶部的距离  —  滚动的距离  —  浏览器的高度
                //console.log("!!", a, this.refs[key].innerText);
            }
        }

    }
    componentDidUpdate() {
        var self = this;
        //如果原来滚动条在最底部就滚动到底部
        if (self.isbuttom)
            self.refs.messageDiv.scrollTop = self.refs.messageDiv.scrollHeight;

        document.getElementById("messageTextArea").focus();
        this.isRead();

    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行 判断滚动条是不是在底部
        var self = this;
        if (self.refs.messageDiv && self.refs.messageDiv.scrollHeight) {
            if (self.refs.messageDiv.scrollTop > (self.refs.messageDiv.scrollHeight - self.refs.messageDiv.clientHeight - 20)) {
                self.isbuttom = true;
            }
            else {
                self.isbuttom = false;
            }
        }

    }
    componentWillUnmount() {
        //准备卸载前执行
        window.deleteMsg == null;
        //截图
        if (window.copyShortcut) {
            nw.App.unregisterGlobalHotKey(window.copyShortcut);
        }
        //截图快捷键
        var copyOption = {
            key: window.userConfig.CopySc
        };

        window.copyShortcut = new nw.Shortcut(copyOption);

        nw.App.registerGlobalHotKey(window.copyShortcut);
        window.copyShortcut.on('active', function () {
            window.child_process.exec("screenshot.exe", null, function (err) { });
        });

        window.copyShortcut.on('failed', function (msg) {
        });

    }
    handleChange(e) {
        this.setState({ message: e.target.value });
        if (e.target.value.length != 0) {
            this.setState({ sendbtn: true });
        }
        else if ((e.target.value.length > 2000)) {
            message.error("文字信息不能大于2000");
            this.setState({ sendbtn: false });
        }
        else {
            this.setState({ sendbtn: false });
        }
    }
    isRemoveGroup() {
        var self = this;
        if (this.props.oftenInfo.Type == "2") {
            if (this.props.oftenInfo.IsRemove == "1") {
                Modal.error({
                    title: '消息通知',
                    content: '您已经被群主移出群聊',
                    onOk() {
                        window.deleteOftenList(self.props.oftenInfo.FriendKey)
                    },
                });
                return false;
            }
            else if (this.props.oftenInfo.IsRemove == "2") {
                Modal.error({
                    title: '消息通知',
                    content: '该群已经解散',
                    onOk() {
                        window.deleteOftenList(self.props.oftenInfo.FriendKey)
                    },
                });
                return false;
            }
        }
        return true;

    }
    sendMessage() {
        //检测是否被踢出群
        var self = this;
        if (!this.isRemoveGroup()) {
            return;
        }
        if (self.state.message.length > 2000)
            message.error("文字信息不能大于2000");
        if (self.state.message.length.length == 0)
            return;
        var self = this;
        if (self.state.message) {
            var tmp = self.state.message;
            window.msgManager.sendMessage({ ReceivedKey: this.props.oftenInfo.FriendKey, Type: this.props.oftenInfo.Type, Context: tmp, MsgType: "1" })
                .done(result => {
                    window.oftensEditLastMsg(this.props.oftenInfo.FriendKey, result.Context);
                    var msgList = self.state.messageListResult;
                    msgList.push(result);

                    if (msgList.length > 20)
                        msgList.splice(0, msgList.length - 20)
                    self.setState({ messageListResult: msgList });
                    self.refs.messageDiv.scrollTop = self.refs.messageDiv.scrollHeight;
                }).fail(function () {
                    self.setState({ message: tmp });
                });
            self.setState({ message: "" });
        }
    }
    handleScroll(detail) {
        this.isRead();
        var self = this;
        if (this.isHaveMoreMsgList)
            return;

        if (detail.target.scrollTop == 0) {
            if (!self.state.msgLoadMore) {
                self.setState({ msgNotHaveMore: false, msgLoading: false, msgLoadMore: true });
                self.refs.messageDiv.scrollTop = 2;
            }
            else {
                var oldScrolHeight = detail.target.scrollHeight;
                self.setState({ msgNotHaveMore: false, msgLoading: true, msgLoadMore: false });
                //获取过去消息列表
                var lastMsgKey = "";
                if (this.state.messageListResult.length > 0)
                    lastMsgKey = this.state.messageListResult[0].Key;
                window.msgManager.messageList({ SendKey: this.props.oftenInfo.FriendKey, Type: this.props.oftenInfo.Type, LastMsgKey: lastMsgKey, PageSize: this.PageSize })
                    .done(result1 => {
                        if (result1.data.length == 0) {
                            self.isHaveMoreMsgList = true;
                            self.setState({ msgNotHaveMore: true, msgLoading: false, msgLoadMore: false });
                        }
                        else {
                            self.setState({ messageListResult: result1.data.concat(self.state.messageListResult), msgNotHaveMore: false, msgLoading: false, msgLoadMore: false });
                        }
                        self.refs.messageDiv.scrollTop = self.refs.messageDiv.scrollHeight - oldScrolHeight;
                    });
            }
        }
    }
    onKeyPress() {
        if (event.keyCode == 13) {
            this.sendMessage();
            event.returnValue = false;
            return;
        }
    }
    onKeyDown() {
        var self = this;
        if (event.keyCode == 13 && event.ctrlKey) {
            self.setState({ message: self.state.message + '\r' });
        }
    }
    getName(key) {
        if (this.props.oftenInfo.Type == "1") {
            return this.props.oftenInfo.FriendName;
        }
        else {
            //如果是群组，进行遍历，名字
            if (this.state.groupAllUser[key]) {
                return this.state.groupAllUser[key].UserName;
            }
            else {
                return "";
            }
            // for (var i = 0; i < this.state.groupAllUser.length; i++) {
            //     if (this.state.groupUserList[i].UserKey == key) {
            //         return this.state.groupUserList[i].UserName;
            //     }
            // }
        }
    }
    //引用事件
    quoteHandle(item) {
        //解决引用的时候出现文件信息
        var context = item.Context;
        if (item.Type == "2") {
            context = "图片";
        }
        else if (item.Type == "3") {
            context = "文件";
        }
        this.setState({ popoverVisible: false, message: this.state.message + "「 @" + this.getName(item.SendKey) + " ：" + context + " 」\r--------\r" });
        //document.getElementById("messageTextArea").focus();
    }
    //转发事件
    forwardHandle(item) {
    }
    revoKeLockMessage(item) {
        var self = this;
        for (var i = 0; i < self.state.messageListResult.length; i++) {
            if (self.state.messageListResult[i].Key == item.Key) {
                self.state.messageListResult.splice(i, 1, { SendKey: item.SendKey, MsgType: "9" });
                break;
            }
        }
        //如果要撤销消息，必须检查上传状态。如果是上传中。必须干掉上传进行
        var downUPList = window.downUpList.getDownUpFile(item.Key);
        if (downUPList) {
            if (downUPList.type == "up" && downUPList.xhr) {
                window.downUpList.abort(item.key);
            }
        }
        // var windowFileList = null;
        // for (var i = 0; i < window.upFileList.length; i++) {
        //     if (window.upFileList[i].MsgKey == item.Key) {
        //         windowFileList = i;
        //         break;
        //     }
        // }
        // window.upFileList = window.upFileList.splice(windowFileList, 1);
        self.setState({ messageListResult: self.state.messageListResult });
    }
    delMessage(item) {
        this.revoKeLockMessage(item);
        window.msgManager.delMessage({ Key: item.Key });
    }
    revokeMessage(item) {
        this.revoKeLockMessage(item);
        window.msgManager.revokeMessage({ Key: item.Key });
    }
    handleVisibleChange(visible) {
        this.setState({ popoverVisible: visible });
    }
    //每条消息的操作
    messageOptsMenu(item) {
        //
        return (<div className="messageOptsMenu">
            <div className="messageOptsMenuOne" onClick={this.quoteHandle.bind(this, item)}>引用</div>
            <div className="messageOptsMenuOne messageOptsMenuOneLast" onClick={this.forwardHandle.bind(this, item)}>转发</div>
        </div>);
    }
    myMessageOptsMenu(item) {
        var date1 = new Date(item.SendTime);  //开始时间
        var date2 = new Date();    //结束时间
        var timespan = date2.getTime() - date1.getTime();
        //
        if (timespan < 1000 * 60 * 20) {
            return <div className="messageOptsMenu">
                <div className="messageOptsMenuOne" onClick={this.revokeMessage.bind(this, item)}>撤销</div>
                <div className="messageOptsMenuOne messageOptsMenuOneLast" onClick={this.forwardHandle.bind(this, item)}>转发</div>
            </div>;
        }
        else {
            return <div className="messageOptsMenu">
                <div className="messageOptsMenuOne messageOptsMenuOneLast" onClick={this.forwardHandle.bind(this, item)}>转发</div>
            </div>;
        }
    }
    formatContextStr(content) {
        var p = /\[.*?\]/g;
        var htmlContent = content.replace(p, function (value) {
            var src = FaceList.getFile(value);
            return '<img src="img/' + src.file + '.png" class="messageContextFace" title="' + src.text + '" />';
        });
        return (<div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>);

    }
    msgIsReadClick(msgItem) {
        this.setState({ groupMsgReadListVisible: true, groupMsgReadListMsgInfo: msgItem });
    }
    //发送表情
    faceHandleSelect(item) {
        var self = this;
        self.setState({ message: self.state.message + item.text, sendbtn: true });
    }
    renderMessageNoMy(item) {
        return (<div className="noMyMessage">
            <div className="phone">
                <a onClick={this.openPersonForm.bind(this, item.SendKey)} >
                    <HeadImg className="img" userKey={item.SendKey} />
                </a>
            </div>

            <div className="content">
                <div className="top"><span className="name">{this.getName(item.SendKey)}</span><span className="time">{item.SendTime}</span></div>
                {this.renderContent(item)}
            </div>
            <div className="optsBtn">
                <Popover content={this.messageOptsMenu(item)} trigger="hover">
                    <div className="btn">…</div>
                </Popover>
            </div>
        </div>
        );
    }
    renderMessageOne(item) {
        console.log("2323423424", item);
        //别人的信息 
        if (item.SendKey != window.LoginUser.Key) {
            if (item.FileUpOver == false) return "";
            if (item.Type == "1") {
                if (item.ReadTime == null) {
                    return (<div id={item.Key} data-type="msgRead" ref={item.Key} className="sendMessage" key={"messagePanel" + item.Key}>
                        {this.renderMessageNoMy(item)}
                    </div>);
                }
            }
            else {
                if (item.ReadPersonCount != this.state.groupUser.length - 1) {
                    return (<div id={item.Key} data-type="msgRead" ref={item.Key} className="sendMessage" key={"messagePanel" + item.Key}>
                        {this.renderMessageNoMy(item)}
                    </div>);
                }
            }
            return (<div className="sendMessage" key={"messagePanel" + item.Key}>
                {this.renderMessageNoMy(item)}
            </div>);
        }
        else {
            //自己的信息
            return (<div className="myMessage" key={"messagePanel" + item.Key}>
                <div className="phone">
                    <a onClick={this.openPersonForm.bind(this, window.LoginUser.Key)}>
                        <HeadImg className="img" userKey={window.LoginUser.Key} />
                    </a>
                </div>
                <div className="content">
                    <div className="top"><span className="name">{window.LoginUser.NickName}</span><span className="time">{item.SendTime}</span></div>
                    {this.renderContent(item)}
                </div>
                <div className="optsBtn">
                    <Popover content={this.myMessageOptsMenu(item)} trigger="hover">
                        <div className="btn">…</div>
                    </Popover>
                    {this.isReadRender(item)}
                </div>
            </div>);
        }
    }
    isReadRender(item) {
        if (item.Type == "1") {
            if (item.ReadTime != null) {
                return <div className="read">已读</div>;
            }
            else {
                if (this.state.arrIsReadSendList[item.Key]) {
                    return <div className="read">已读</div>;
                }
                else {
                    return <div className="noread">未读</div>;
                }
            }
        }
        else {
            //群聊
            if (item.ReadPersonCount == this.state.groupUserList.length - 1) {
                return <div className="read">全部已读</div>;
            }
            else {
                if (this.state.arrIsReadSendList[item.Key]) {
                    if (this.state.arrIsReadSendList[item.Key] == this.state.groupUserList.length - 1) {
                        return <div className="read">全部已读</div>;
                    }
                    else {
                        return <div className="noread" onClick={this.msgIsReadClick.bind(this, item)}>{this.state.groupUserList.length - this.state.arrIsReadSendList[item.Key] - 1}人未读</div>;
                    }
                }
                else {
                    return <div className="noread" onClick={this.msgIsReadClick.bind(this, item)}>{this.state.groupUserList.length - item.ReadPersonCount - 1}人未读</div>;
                }

            }
        }


    }
    renderContent(item) {
        if (item.MsgType == "1") {
            return <div className="message"><i className="sji"></i><b className="sjb"></b><pre>{this.formatContextStr(item.Context)}</pre></div>;
        }
        else if (item.MsgType == "2") {
            return <div className="message pic picminWidth"><i className="sji"></i><b className="sjb"></b><SendPic delFileSendMessage={this.delMessage.bind(this)} msg={item} /></div>;
        }
        else if (item.MsgType == "3") {
            return <div className="message pic fileminWidth"><i className="sji"></i><b className="sjb"></b><SendPic delFileSendMessage={this.delMessage.bind(this)} msg={item} /></div>;
        }
    }
    renderMessageList() {
        this.befMessage = null;
        return this.state.messageListResult.map(function (item, index) {
            var more = false;
            if (this.befMessage == null || ((new Date(item.SendTime)) - (new Date(this.befMessage.SendTime))) > 1000 * 60 * 10) {
                more = true;
            }
            this.befMessage = item;
            if (item.MsgType == "9") {
                if (item.SendKey != window.LoginUser.Key) {
                    return (<div className="moreDateTime">{this.getName(item.SendKey)}撤回了一条消息</div>);
                }
                else
                    return (<div className="moreDateTime">您撤回了一条消息</div>);
            }
            else {
                return (<div>{more ? <div className="moreDateTime">{Util.getLastDateTime(item.SendTime)}</div> : ""}
                    {this.renderMessageOne(item)}
                </div>)
            }

        }.bind(this));
    }
    onChangeHandle(info) {
        if (this.refs.sendFileImg) {
            this.refs.sendFileImg.src = "";
        }
        if (info.file.status !== 'uploading') {
            var arr = info.file.name.toLocaleLowerCase().split('.');
            if (arr.length > 0) {
                var extName = arr[arr.length - 1];
                if (extName == "jpg" || extName == "png" || extName == "gif" || extName == "bmp" || extName == "webp") {
                    this.setState({ sendFileModal: true, originFileObj: info.file.originFileObj });
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = this.refs.sendFileImg;
                        img.src = e.target.result;
                    }.bind(this);
                    reader.readAsDataURL(info.file.originFileObj);
                    return;
                }
            }
            this.setState({ sendFileModal: true, originFileObj: info.file.originFileObj, sendFileSrc: "img/" + Util.getFileExt(info.file.originFileObj.name) + ".png" });
        }
    }
    okClickHandle() {
        var self = this;
        window.msgManager.messageFileSend({ ReceivedKey: this.props.oftenInfo.FriendKey, FileName: this.state.originFileObj.name, Type: this.props.oftenInfo.Type })
            .done(function (result) {
                //window.upFileAdd(self.state.originFileObj, result);
                Util.upload(result.Key, result.Key, self.state.originFileObj.name, self.state.originFileObj.size, self.state.originFileObj, result);
                self.state.messageListResult.push(result);
                self.setState({ messageListResult: self.state.messageListResult, sendFileModal: false });
                self.refs.messageDiv.scrollTop = self.refs.messageDiv.scrollHeight;
            });
    }
    handleFileModelCancel() {
        this.setState({ sendFileModal: false, groupUserKey: "", groupIsExist: false, originFileObj: {} });
    }
    openGroupHandle(value) {
        var self = this;
        //如果群组不存在存在
        if (self.props.oftenInfo.Type == "1") {
            self.setState({ groupUser: [] });
            self.state.groupUser.push({ key: window.LoginUser.Key, label: window.LoginUser.NickName });
            self.state.groupUser.push({ key: self.props.oftenInfo.FriendKey, label: self.props.oftenInfo.FriendName });
            self.setState({ groupVisible: true, groupUserKey: self.props.oftenInfo.FriendKey, groupIsExist: false, groupName: "", groupUser: self.state.groupUser });
        }
        //如果群组不存在
        if (self.props.oftenInfo.Type == "2") {
            self.setState({ groupUser: [] });

            for (var i = 0; i < self.state.groupUserList.length; i++) {
                self.state.groupUser.push({ key: self.state.groupUserList[i].UserKey, label: self.state.groupUserList[i].UserName });
            }
            self.setState({ groupVisible: true, groupUserKey: self.props.oftenInfo.FriendKey, groupIsExist: true, groupName: self.props.oftenInfo.FriendName, groupUser: self.state.groupUser });
        }
    }
    //个人信息
    openPersonForm(value) {
        this.setState({ personVisible: true, userKey: value });
    }
    //群组管理
    openGroupForm(e) {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({ groupSettingVisible: true })
    }
    cancelGroupFormHandle() {
        //重新加载
        this.reloadGroupInfo(this.props.oftenInfo);
        this.setState({ groupVisible: false, groupUserKey: "", groupIsExist: false, groupName: "", groupUser: [] });
    }
    scrSpyHandle(e) {
        var self = this;
        var clipboard = nw.Clipboard.get();
        clipboard.clear();
        if (e && e.shiftKey == false)
            nw.Window.get().minimize();
        setTimeout(function () {
            window.child_process.exec("screenshot.exe", null, function (err) {
                if (err) {
                    message.success(err);
                }
                else {
                    // Read from clipboard
                    var png = clipboard.get('png');
                    if (png != null) {
                        var bytes = window.atob(png.split(',')[1]);        //去掉url的头，并转换为byte

                        //处理异常,将ascii码小于0的转换为大于0
                        var ab = new ArrayBuffer(bytes.length);
                        var ia = new Uint8Array(ab);
                        for (var i = 0; i < bytes.length; i++) {
                            ia[i] = bytes.charCodeAt(i);
                        }

                        var blob = new Blob([ab], { type: 'image/png' });
                        blob.name = "截图.png";
                        self.setState({ sendFileModal: true, originFileObj: blob, sendFileSrc: png });
                    }
                    nw.Window.get().show();
                }
            });
        }, 50);

    }
    clipboar() {
        var clipboard = nw.Clipboard.get();
        var png = clipboard.get('png');
        clipboard.clear();
        if (png != null) {
            var bytes = window.atob(png.split(',')[1]);        //去掉url的头，并转换为byte

            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            var blob = new Blob([ab], { type: 'image/png' });
            blob.name = "截图.png";
            self.setState({ sendFileModal: true, originFileObj: blob, sendFileSrc: png });
        }
    }
    cancelPersonFormHandle(value) {
        this.setState({ personVisible: false });
    }
    dragleaveHandle(e) {
        e.preventDefault();
    }
    dropHandle(e) {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            var file = e.dataTransfer.files[0];
            var arr = file.name.toLocaleLowerCase().split('.');
            if (arr.length > 0) {
                if (arr[1] == "jpg" || arr[1] == "png" || arr[1] == "gif" || arr[1] == "bmp" || arr[1] == "webp") {
                    this.setState({ sendFileModal: true, originFileObj: file });
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = this.refs.sendFileImg;
                        img.src = e.target.result;
                    }.bind(this);
                    reader.readAsDataURL(file);
                    return;
                }
            }

            this.setState({ sendFileModal: true, originFileObj: file, sendFileSrc: "img/" + Util.getFileExt(file.name) + ".png" });
        }

    }
    dragenterHandle(e) {
        e.preventDefault();

    }
    dragoverHandle(e) {
        e.preventDefault();
    }
    pasteHandle(e) {
        for (var i = 0; i < e.clipboardData.items.length; i++) {
            var c = e.clipboardData.items[i];
            if (c.type == "image/png") {
                var clipboard = nw.Clipboard.get();
                var png = clipboard.get('png');
                if (png != null) {
                    var bytes = window.atob(png.split(',')[1]);        //去掉url的头，并转换为byte
                }
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                var blob = new Blob([ab], { type: 'image/png' });
                blob.name = "截图.png";
                this.setState({ sendFileModal: true, originFileObj: blob, sendFileSrc: png });
            }

        }
    }
    openFileListHandle(e) {
        e.nativeEvent.stopImmediatePropagation()
        //打开文件列表
        this.setState({ fileListVisible: true })
    }
    handlCloseFileList() {
        //关闭文件列表
        this.setState({ fileListVisible: false })
    }
    handlCloseGroupSettingList() {
        this.setState({ groupSettingVisible: false })
    }
    openGroupBriefHandle() {
        this.setState({ groupBriefVisible: true })

    }
    handlCloseGroupBrief() {
        this.setState({ groupBriefVisible: false })

    }
    render() {
        //如果是群组渲染群组设置
        var groupSetting = "";
        var groupBrief = "";
        var groupMsgReadList = "";
        if (this.props.oftenInfo.Type == "2") {
            groupSetting = (<ModalPanel title="群设置" closePanel={this.handlCloseGroupSettingList.bind(this)} visible={this.state.groupSettingVisible}>
                <GroupSetting groupInfo={this.state.groupInfo}
                    visiblePanel={this.state.groupSettingVisible}
                    groupUserList={this.state.groupUserList}
                    groupNameGet={this.getName.bind(this)}
                    groupUserAllName={this.state.groupAllUser}
                    addGroupUser={this.openGroupHandle.bind(this)}
                    reloadGroupInfo={function (key, name) {
                        this.reloadGroupInfo({ FriendKey: key });

                    }.bind(this)}
                />
            </ModalPanel>);
            groupBrief = (<ModalPanel title="群公告" closePanel={this.handlCloseGroupBrief.bind(this)} visible={this.state.groupBriefVisible}>
                <Brief groupInfo={this.state.groupInfo}
                    visiblePanel={this.state.groupBriefVisible}
                    groupNameGet={this.getName.bind(this)}
                    reloadGroupInfo={function (key, name) {
                        this.reloadGroupInfo({ FriendKey: key });
                    }.bind(this)}
                />
            </ModalPanel>);

            //群聊,用来查看未读人员
            groupMsgReadList = <GroupMsgReadList
                visible={this.state.groupMsgReadListVisible}
                groupInfo={this.state.groupInfo}
                groupNameGet={this.getName.bind(this)}
                groupUserList={this.state.groupUserList}
                msgInfo={this.state.groupMsgReadListMsgInfo}
                closePanel={function () {
                    this.setState({ groupMsgReadListVisible: false });
                }.bind(this)}
            />

        }
        //根据类型不一样生成不一样抬头
        var headName = ""
        if (this.props.oftenInfo.Type == "1") {
            headName = (<div className="headName">
                <div className="name">{this.props.oftenInfo.FriendName}</div>
                <div className="unit">{this.state.userInfo.OrgName ? this.state.userInfo.OrgName : ""}{this.state.userInfo.Phone ? "-" + this.state.userInfo.Phone : ""}</div>
            </div>);
        }
        else {
            headName = (<div className="headName">
                <div className="name">{this.state.groupInfo.GroupName ? this.state.groupInfo.GroupName : this.props.oftenInfo.FriendName}</div>
                <Tooltip mouseLeaveDelay={0} title={"更多点击右边群公告"}><div className="unit">{this.state.groupInfo.GroupBrief}</div></Tooltip>
            </div>);
        }
        return (<div className="messageSend"
            onDragleave={this.dragleaveHandle.bind(this)}
            onDrop={this.dropHandle.bind(this)}
            onDragenter={this.dragenterHandle.bind(this)}
            onDragover={this.dragoverHandle.bind(this)}
        >
            <div className="messageTitle">
                <div className="left">
                    <HeadImg type={this.props.oftenInfo.Type} className={this.props.oftenInfo.Type == "2" ? "img groupimg" : "img"} userKey={this.props.oftenInfo.FriendKey} />
                    {headName}
                </div>
                <div className="right">
                    {this.props.oftenInfo.Type == "1" ? "" : <Tooltip mouseLeaveDelay={0} title="群公告"><a className="optBtn" onClick={this.openGroupBriefHandle.bind(this)}><Icon type="notification" /></a></Tooltip>}
                    <Tooltip mouseLeaveDelay={0} title="聊天文件"><a className="optBtn" onClick={this.openFileListHandle.bind(this)}><Icon type="folder" /></a></Tooltip>
                    {this.props.oftenInfo.Type == "2" ? "" : <Tooltip mouseLeaveDelay={0} title="添加新成员"><a className="optBtn" onClick={this.openGroupHandle.bind(this)}><Icon type="plus" /></a></Tooltip>}
                    {this.props.oftenInfo.Type == "2" ? "" : <Tooltip mouseLeaveDelay={0} title="个人简介"><a className="optBtn" onClick={this.openPersonForm.bind(this, this.props.oftenInfo.FriendKey)}><Icon type="info-circle-o" /></a></Tooltip>}
                    {this.props.oftenInfo.Type == "1" ? "" : <Tooltip mouseLeaveDelay={0} title="群设置"><a className="optBtn" onClick={this.openGroupForm.bind(this)}><Icon type="team" /></a></Tooltip>}
                </div>
            </div>
            <div className="messageList" ref="messageDiv" onScroll={this.handleScroll.bind(this)}>
                {this.state.msgLoading ? <div className="messageListLoadMore">正在加载,请稍等.</div> : ""}
                {this.state.msgNotHaveMore ? <div className="messageListLoadMore">没有更多消息</div> : ""}
                {this.state.msgLoadMore ? <div className="messageListLoadMore">查看更多消息</div> : ""}
                {this.renderMessageList()}
            </div>
            <div className="messageSendExt">
                <Tooltip mouseLeaveDelay={0} title="附件"><a><Upload onChange={this.onChangeHandle.bind(this)}><Icon type="paper-clip" /></Upload ></a></Tooltip>
                <Tooltip mouseLeaveDelay={0} title="表情"><a><FaceSelect handleSelect={this.faceHandleSelect.bind(this)} /></a></Tooltip>
                <Tooltip mouseLeaveDelay={0} title="云文件功能研发中"><a><Icon type="cloud-download-o" /></a></Tooltip>
                <Tooltip mouseLeaveDelay={0} title="截图-(按住shift键可显示本窗体)"><a onClick={this.scrSpyHandle.bind(this)}><Icon type="scan" /></a></Tooltip>
            </div>
            <div className="messageSendArea">
                <div className="messageSendInput">
                    <Input id="messageTextArea" type="textarea"
                        onKeyDown={this.onKeyDown.bind(this)}
                        onKeyPress={this.onKeyPress.bind(this)}
                        placeholder="聊点什么"
                        className="SendInput"
                        value={this.state.message}
                        onPaste={this.pasteHandle.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div className="messageSendBtn">
                    <Button className="SendBtn" type="ghost" onClick={this.sendMessage.bind(this)} disabled={!this.state.sendbtn} >发送</Button>
                </div>
            </div>
            <Modal
                title="发送文件"
                wrapClassName="vertical-center-modal"
                visible={this.state.sendFileModal}
                onOk={this.okClickHandle.bind(this)}
                onCancel={this.handleFileModelCancel.bind(this)}
                okText="发送" cancelText="取消"
                width={400}
            >
                <div className="sendFileModalPanel">
                    <div className="img"><img ref="sendFileImg" src={this.state.sendFileSrc} /></div>
                    <div className="content">
                        <div className="name">{this.state.originFileObj.name}</div>
                        <div className="size">{Util.getFileSize(this.state.originFileObj.size)}</div>
                    </div>
                </div>
            </Modal>
            <GroupForm
                visible={this.state.groupVisible}
                friendKey={this.state.groupUserKey}
                groupIsExist={this.state.groupIsExist}
                groupName={this.state.groupName}
                groupUser={this.state.groupUser}
                handleCancel={this.cancelGroupFormHandle.bind(this)} />
            <PersonForm
                visible={this.state.personVisible}
                userKey={this.state.userKey}
                handleCancel={this.cancelPersonFormHandle.bind(this)} />
            <ModalPanel title="聊天文件" closePanel={this.handlCloseFileList.bind(this)} visible={this.state.fileListVisible}>
                <FileList friendInfo={this.props.oftenInfo} />
            </ModalPanel>
            {groupSetting}
            {groupBrief}
            {groupMsgReadList}
        </div>);
    }
}
MessageSend.propTypes = {};
MessageSend.defaultProps = {
    oftenInfo: {},
    newMessage: {},
    noReadMessageCount:0,
    draftMsg: function (key, value) { }
};