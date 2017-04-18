import React, { Component } from 'react';
import { Menu, Breadcrumb, Icon, Row, Col, message, Tabs, Dropdown, Form, Spin, Badge, Modal } from 'antd';
const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;

import './messageView.less';

import MessageSend from './MessageSend.js';
import HeadImg from '../publicModule/headImg.js'
import Welcome from './welcome.js';
import Util from '../../mod/util/util.js'

export default class messageView extends Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.versionList = [];//版本列表
        this.serviceTypes = [];//服务器类型
        this.defaultActiveKey = "-1";
        this.state = {
            reload: true,
            activeKey: this.defaultActiveKey,
            newMessage: {},
            showMessageInfo: null
        };

    }
    componentDidMount() {
        var self = this;

        window._msgManager.sendMsg = function (resultMsg) {
            window.msgManager.sendMsgReturn({ NoSendKey: resultMsg.NoSendKey })
            //先找到原来的,如果原来的中间不存在,则创建一个新的放在最前边
            //如果找到原来的,则将原来的数字加1并放在最前边
            var oldOften = null;
            for (var i = 0; i < window.oftens.length; i++) {
                if (resultMsg.Type == "1") {
                    if (window.oftens[i].FriendKey == resultMsg.SendKey) {
                        oldOften = window.oftens[i];
                        window.oftens.splice(i, 1);
                        break;
                    }
                }
                else {
                    //如果是群消息必须用接收者去判断.
                    if (window.oftens[i].FriendKey == resultMsg.ReceivedKey) {
                        oldOften = window.oftens[i];
                        window.oftens.splice(i, 1);
                        break;
                    }
                }
            }
            if (oldOften != null) {
                if (self.state.activeKey != oldOften.Key) {
                    oldOften.MessageCount++;
                }

                //进行后台更新.
                if (resultMsg.Type == "1") {
                    oldOften.LastMsgContext = resultMsg.Context;
                    window.oftens.splice(0, 0, oldOften);
                    window.msgManager.myOftenListAdd({ FriendKey: resultMsg.SendKey, Type: resultMsg.Type, LastMsgContext: oldOften.LastMsgContext });
                }
                else {
                    oldOften.LastMsgContext = resultMsg.SendName + "：" + resultMsg.Context;
                    window.oftens.splice(0, 0, oldOften);
                    window.msgManager.myOftenListAdd({ FriendKey: resultMsg.ReceivedKey, Type: resultMsg.Type, LastMsgContext: oldOften.LastMsgContext });
                }
                self.setState({ newMessage: resultMsg });
                resultMsg.Name = oldOften.FriendName;
                Util.newMessage(resultMsg);
            }
            else {
                //先进行添加.然后在添加
                if (resultMsg.Type == "1") {
                    window.msgManager.myOftenListAdd({ FriendKey: resultMsg.SendKey, Type: resultMsg.Type, LastMsgContext: oldOften.LastMsgContext })
                        .done(function (result) {
                            result.MessageCount++;
                            result.LastMsgContext = resultMsg.Context;
                            window.oftens.splice(0, 0, result);
                            resultMsg.Name = result.FriendName;
                            Util.newMessage(resultMsg);
                            self.setState({ newMessage: resultMsg });
                        });
                }
                else {
                    window.msgManager.myOftenListAdd({ FriendKey: resultMsg.ReceivedKey, Type: resultMsg.Type, LastMsgContext: oldOften.LastMsgContext })
                        .done(function (result) {
                            result.MessageCount++;
                            result.LastMsgContext = resultMsg.SendName + "：" + resultMsg.Context;
                            window.oftens.splice(0, 0, result);
                            resultMsg.Name = result.FriendName;
                            Util.newMessage(resultMsg);
                            self.setState({ newMessage: resultMsg });
                        });
                }
            }
        };

        window._msgManager.receiveMsg = function (result) {
            for (var i = 0; i < window.oftens.length; i++) {
                if (result.Type == "1") {
                    if (self.state.activeKey != window.oftens[i].Key && window.oftens[i].FriendKey == result.SendKey) {
                        if (window.oftens[i].MessageCount > 0)
                            window.oftens[i].MessageCount--;
                        break;
                    }
                }
                else {
                    if (self.state.activeKey != window.oftens[i].Key && window.oftens[i].FriendKey == result.ReceivedKey) {
                        if (window.oftens[i].MessageCount > 0)
                            window.oftens[i].MessageCount--;
                        break;
                    }
                }
            }
            self.setState({ newMessage: result });
        };
        window._orgManager.deleteGroupSend = function (groupInfo) {
            //第一步更新
            for (var i = 0; i < window.oftens.length; i++) {
                if (window.oftens[i].FriendKey == groupInfo.Key) {
                    window.oftens[i].IsRemove = true;
                    break;
                }
            }
            self.setState({ reload: true });
        };
        window.deleteOftenList = function (key) {
            for (var i = 0; i < window.oftens.length; i++) {
                if (window.oftens[i].FriendKey == key) {
                    var deleOften = window.oftens[i];
                    window.msgManager.myOftenListDel({ Key: deleOften.Key })
                        .done(function () {
                            if (window.oftens.length > 0) {
                                self.setState({ activeKey: window.oftens[0].Key, showMessageInfo: window.oftens[0] });
                            }
                        });
                    window.oftens.splice(i, 1);
                    break;
                }
            }
        };

        window.oftensEditName = function (key, value) {
            for (var i = 0; i < window.oftens.length; i++) {
                if (window.oftens[i].FriendKey == key) {
                    window.oftens[i].FriendName = value;
                    self.setState({ reload: true });
                    break;
                }
            }
        }
        window.oftensEditLastMsg = function (key, value) {
            for (var i = 0; i < window.oftens.length; i++) {
                if (window.oftens[i].FriendKey == key) {
                    window.oftens[i].LastMsgContext = value;
                    self.setState({ reload: true });
                    break;
                }
            }
        }
        window.appThis.setState({ havNewMessage: false, selectedKey: window.defaultSelectedKey });
        console.log("!获取我所有未读的消息");
        window.msgManager.noSendMsgGet();
        window.isFirst = false;

    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        var self = this;
        if (window.NewSelectKey) {
            console.log("!!!!!!!!!!", window.NewSelectKey);
            if (window.NewSelectKey) {
                self.setState({ activeKey: window.NewSelectKey.Key, showMessageInfo: window.NewSelectKey });
            }
            else {
                self.setState({ activeKey: window.oftens[0].Key, showMessageInfo: window.oftens[0] });
            }
            window.NewSelectKey = null;
        }

    }
    componentDidUpdate() {

    }
    componentWillUnmount() {
        //准备卸载前执行
        window.oftensEditName = null;
        window.NewSelectKey = null;
    }
    draftMsgSave(key, msg) {
        for (var i = 0; i < window.oftens.length; i++) {
            if (window.oftens[i].Key == key) {
                window.oftens[i].draft = msg;
                //用于回传到文本框的
                window.oftens[i].draftText = msg;
                this.setState({ reload: true });
                break;
            }
        }
    }
    closeOften(Key, e) {
        var self = this;
        window.msgManager.myOftenListDel({ Key: Key })
            .done(function () {
                for (var i = 0; i < window.oftens.length; i++) {
                    if (window.oftens[i].Key == Key) {
                        window.oftens.splice(i, 1);
                        break;
                    }
                }
                if (window.oftens.length != 0)
                    self.setState({ activeKey: window.oftens[0].Key, showMessageInfo: window.oftens[0] });
                else
                    self.setState({ activeKey: self.defaultActiveKey, showMessageInfo: null });
            });
        if (e.stopPropagation && e.nativeEvent.stopImmediatePropagation) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }

    }
    onTabClickHandle(item, e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        var self = this;
        if (item.IsRemove == "1") {
            Modal.error({
                title: '消息通知',
                content: '您已经被群主移出群聊',
                onOk() {
                    for (var i = 0; i < window.oftens.length; i++) {
                        if (window.oftens[i].Key == item.Key) {
                            window.oftens.splice(i, 1);
                            self.closeOften(item.Key);
                            break;
                        }
                    }
                },
            });
        }
        else if (item.IsRemove == "2") {
            Modal.error({
                title: '消息通知',
                content: '该群已经解散',
                onOk() {
                    for (var i = 0; i < window.oftens.length; i++) {
                        if (window.oftens[i].Key == item.Key) {
                            window.oftens.splice(i, 1);
                            self.closeOften(item.Key);
                            break;
                        }
                    }
                },
            });
        }
        else {
            for (var i = 0; i < window.oftens.length; i++) {
                if (window.oftens[i].Key == item.Key) {
                    window.oftens[i].MessageCount = 0;
                    window.oftens[i].draft = "";
                    self.setState({ activeKey: item.Key, showMessageInfo: window.oftens[i] });

                    break;
                }
            }

        }

    }
    newMessageBind(item) {
        if (this.state.newMessage.Type == "1") {
            if (this.state.newMessage.SendKey == item.FriendKey) {
                return this.state.newMessage;
            }
        }
        else {
            if (this.state.newMessage.ReceivedKey == item.FriendKey) {
                return this.state.newMessage;
            }
        }
        return null
    }

    renderList() {
        if (window.oftens.length == 0) {
            return <div className="nullOftens">
                还没有聊天窗口，通过搜索创建一个吧。
            </div>
        }
        return window.oftens.map(function (item, index) {
            var activeClass = "oftenOne";
            if (this.state.activeKey == item.Key) {
                activeClass = activeClass + " oftenOneSelect";
            }
            return (<div className={activeClass} onClick={this.onTabClickHandle.bind(this, item)} key={"oftenPanel" + item.Key}>
                <a className="closeOften" onClick={this.closeOften.bind(this, item.Key)}><Icon type="cross" /></a>
                <div className="left">
                    <HeadImg type={item.Type} className={item.Type == "2" ? "img groupimg" : "img"} userKey={item.FriendKey} />
                    <div className="oftenMsgInfo">
                        <div className="oftenUserName">
                            {item.FriendName}
                        </div>
                        {item.draft ?
                            <div className="oftenMsgContext draft">
                                {"草稿：" + item.draft}
                            </div> :
                            <div className="oftenMsgContext">
                                {item.LastMsgContext}
                            </div>}

                    </div>
                </div>
                <div className="right">
                    <div className="lastTime">{Util.getLastTime(item.LastTime ? item.LastTime : item.EditTime)}</div>
                    <div className="otherInfo">
                        <Badge count={item.MessageCount} overflowCount={99}></Badge>
                    </div>
                </div>

            </div>);
        }.bind(this));
        // return this.state.oftens.map(function (item, index) {
        //     console.log("````````````````````-", item.Key);
        //     return (<TabPane tab={<div className="messageSendListOne">
        //         <a className="closeOften" onClick={this.closeOften.bind(this, item.Key) }><Icon type="cross" /></a>
        //         <HeadImg type={item.Type} className={item.Type == "2" ? "img groupimg" : "img"} userKey={item.FriendKey} />
        //         <Badge count={item.MessageCount} >{item.FriendName}</Badge></div>} key={item.Key}>

        //     </TabPane>);
        // }.bind(this));
    }
    render() {
        return (<div className="message">
            <div className="oftenList">
                {this.renderList()}
            </div>
            <div className="messageSendContext">
                {this.state.showMessageInfo != null ?
                    <MessageSend
                        oftenInfo={this.state.showMessageInfo}
                        newMessage={this.newMessageBind(this.state.showMessageInfo)}
                        draftMsg={this.draftMsgSave.bind(this)}
                        /> :
                    <Welcome />
                }
            </div>
        </div>);
    }
}
