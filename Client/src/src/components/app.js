import React, { Component } from 'react';
import { Menu, Breadcrumb, Icon, Row, Col, message, Modal, Popover, notification, Badge, Progress } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
const SubMenu = Menu.SubMenu;

import { hashHistory } from 'react-router'
import './app.less';
import Login from 'login.js';
import Util from './mod/util/util.js'
import SearchInput from './searchInput.js'
import HeadImg from './pages/publicModule/headImg.js'
import Setting from './pages/setting.js';
import DownUpList from './downUpList.js';
import Version from './version.js';
import Feedback from './feedback.js';
import Copyright from './copyright.js';
import EditPassword from './editPassword.js';
import PersonForm from './pages/publicModule/PersonForm.js'

export default class App extends Component {
    constructor(props) {
        super(props);
        window.isClose = false;
        window.winIsFocus = true;
        window.isHide = false;
        this.keepTimer = null;
        this.timerHandle = null;
        window.isLogin = false;
        this.winstate = true;
        window.oftens = [];
        window.defaultSelectedKey = "/messageView";
        window.appThis = this;
        this.timerUpFile = null;
        window.isFirst = true;
        this.state = {
            isLogin: window.isLogin || false,
            isHasNet: false,
            isLoading: false,
            selectedKey: window.defaultSelectedKey,
            LoginUser: {},
            editPasswordVisible: false,
            havNewMessage: false,
            imgResult: null,
            settingVisible: false,
            loginUserPersonVisible: false,
            NoReadMessageCount: 0

        }
        message.config({
            top: 100,
            duration: 2,
        });
        notification.config({
            top: 100,
            duration: 5,
        });
        //监听路由的变化，如果变化从新注册接受事件
        hashHistory.listen(function (location) {
            console.log(location, location.hash)
            window.hashHistoryNow = location.hash || window.defaultSelectedKey;

            if (window.msgManager) {
                console.log("切换页面，准备注册sendMsg1,window._msg.sendMsg");
                if (location.pathname != "/messageView") {
                    window._msgManager.sendMsg = this.sendMessage;
                    window._msgManager.receiveMsg = this.receiveMsg;
                }
            }
        }.bind(this));
    }
    receiveMsg(result) {
        console.log("接受到新消息app", result);
        for (var i = 0; i < window.oftens.length; i++) {
            if (window.oftens[i].FriendKey == result.SendKey) {
                window.oftens[i].MessageCount > 0 ? window.oftens[i].MessageCount-- : null;
                break;
            }
        }
        notification.close(result.SendKey);
        notification.info({
            message: result.SendName,
            description: "撤回了一条消息",
            key: result.Key
        });
    }
    ShowMessage() {

    }
    sendMessage(resultMsg) {
        var count = window.appThis.state.NoReadMessageCount + 1;
        Util.newMessage(resultMsg);
        window.appThis.setState({ NoReadMessageCount: count });
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        console.log("!!!!!!!!!!!!!!!!!", window.NewSelectKey, window.defaultSelectedKey);
        if (window.NewSelectKey) {
            this.setState({ selectedKey: window.defaultSelectedKey });
        }
    }
    handleClick(e) {
        console.log(e, hashHistory);
        if (e.key == window.defaultSelectedKey) {
            this.setState({ selectedKey: e.key, NoReadMessageCount: 0 });
        }
        else {
            this.setState({ selectedKey: e.key });
        }

        hashHistory.replace(e.key);
        //hashHistory.push(e.key);
    }
    handleClick1(e) {
        if (e.key == "setting") {
            console.log("显示设置窗体");
            this.setState({ settingVisible: true });
        }
        if (e.key == "editPassword") {
            console.log("显示设置窗体");
            this.setState({ editPasswordVisible: true });
        }
    }
    handleSubmit(values) {
        var self = this;
        if (!self.state.isHasNet) return;
        this.setState({ isLoading: true });

        window.GetMessageService(values).done(function (json) {
            console.log("获取服务器信息成功", json);
            //准备启动连接到消息服务器
            window.MessageServiceInfo = json;
            window.myStart(function () {
                console.log("连接到消息服务器成功!");
                window.userManager.signIn(json).done(resultLoginUser => {
                    console.log("获取登录成功", resultLoginUser);
                    ////先获取头像服务器
                    window.fileManager.getPhotoService().done(resultPhoto => {
                        console.log("头像服务器获取成功", resultPhoto);
                        window.HeadPhotoService = resultPhoto;

                        window.isLogin = true;
                        window.LoginUser = resultLoginUser;

                        //在这里注册不知道还有问题没有

                        console.log(window.msgManager);
                        window._userManager.reLogin = function () {
                            self.setState({ isLogin: false });
                        };
                        //拉去最近消息列表
                        window.msgManager.myOftenList()
                            .done(function (result) {
                                window.oftens = result;
                                window._msgManager.sendMsg = self.sendMessage;
                                window._msgManager.receiveMsg = self.receiveMsg;
                                self.setState({ isLogin: true, LoginUser: resultLoginUser, selectedKey: window.defaultSelectedKey, NoReadMessageCount: 0 });
                                //注册整体管理
                                window.NewSelectKey = null;
                                console.log("!!!!!!!!!");
                                window.OftenListAdd = function (friendKey, type) {
                                    window.msgManager.myOftenListAdd({ FriendKey: friendKey, Type: type })
                                        .done(function (result) {
                                            for (var i = 0; i < window.oftens.length; i++) {
                                                if (window.oftens[i].Key == result.Key) {
                                                    window.oftens.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            window.oftens.splice(0, 0, result);
                                            window.NewSelectKey = result;
                                            hashHistory.replace(window.defaultSelectedKey);
                                        });
                                }
                            });


                        //获取用户配置,并注册快捷键
                        window.userManager.settingConfigGet()
                            .done(function (result) {
                                window.userConfig = result;
                                Util.configSet(result);
                                console.log("settingConfigGet", result);
                            });
                        Util.trayRegedit();
                        console.log(window.LoginUser);
                        if (window.LoginUser.PassWord == "3B21A153978DC25FCD3507841947E2B3") {
                            self.setState({ isLoading: false, editPasswordVisible: true });
                        }
                        else {
                            self.setState({ isLoading: false });
                        }
                        nw.Window.get().on('close', function () {
                            console.log("!拦截窗体关闭");
                            // Hide the window to give user the feeling of closing immediately
                            console.log(window.isClose);
                            if (window.isClose) {
                                nw.Window.get().close(true);
                            }
                            else {
                                nw.Window.get().hide();
                            }

                        });
                    });
                }).fail(function (error) {
                    console.log("登录失败", error)
                }).always(function () {
                    self.setState({ isLoading: false });
                });
            }, function (error) {
                self.setState({ isHasNet: false });
            }, function (change) {
                //状态改变
            }, function () {
                //服务器断开
                //console.log();
                self.setState({ isLogin: false, isHasNet: false });
            });
        }).fail(function () {
            self.setState({ isLoading: false });
        });

    }
    componentDidMount() {
        nw.Window.get().on('blur', function () {
            window.winIsFocus = false;
        });
        nw.Window.get().on('focus', function () {
            window.winIsFocus = true;
        });

        var self = this;

        self.setState({ isHasNet: false });
        //用新的方式连接
        window.testNet().done(function () {
            self.setState({ isHasNet: true });

        }).fail(function () {
            message.error("无法连接到服务器请重试.");
            self.setState({ isHasNet: false });
        });
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentDidUpdate() {
    }
    editPassword() {
        this.setState({ editPasswordVisible: true });
    }
    handleEditPasswordSubmitEdit(values) {
        var self = this;
        window.userManager.editPassword(values)
            .done(function (result) {
                self.setState({ editPasswordVisible: false });
                message.success("修改成功");
            });
    }
    hidePasswordModal() {
        this.setState({ editPasswordVisible: false });
    }
    min() {
        window.isHide = true;
        var win = nw.Window.get();
        win.minimize();
    }
    max() {
        var win = nw.Window.get();
        if (this.winstate) {
            win.maximize();
        }
        else {
            win.restore()
        }
        this.winstate = !this.winstate;

    }
    close() {
        window.isHide = true;
        var win = nw.Window.get();
        win.hide();
    }

    searchHandle(values) {
        var self = this;
        window.OftenListAdd(values.Key, values.Type);
    }
    openMyPersonInfo() {
        this.setState({ loginUserPersonVisible: true });
    }
    //关闭自己的信息
    cancelPersonFormHandle() {
        this.setState({ loginUserPersonVisible: false });
    }
    render() {
        if (!this.state.isLogin) {
            //return (<div>12</div>)
            return (<Login handleSubmit={this.handleSubmit.bind(this)} isLoading={this.state.isLoading} isHasNet={this.state.isHasNet} />);
        }
        else {
            var menu = this.state.selectedKey;
            return (
                <div className="ant-layout-aside">
                    <div className="ant-layout-header">
                        <div className="ant-layout-logo"><Icon type="aliwangwang" />内部安全通讯</div>
                        <div className="ant-layout-header-menu">
                            <div className="ant-layout-header-search">
                                <SearchInput placeholder="搜索联系人"
                                    onSearch={this.searchHandle.bind(this)} style={{ width: 270 }}
                                    />
                            </div>
                            <div className="downUPBtn">
                                <DownUpList />
                            </div>
                            <div className="ant-layout-header-close">
                                <a><Icon onClick={this.min.bind(this)} type="minus" /></a>
                                <a><Icon onClick={this.max.bind(this)} type="plus" /></a>
                                <a><Icon onClick={this.close.bind(this)} type="cross" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="ant-layout-main">
                        <aside className="ant-layout-sider">
                            <div className="ant-layout-user" onClick={this.openMyPersonInfo.bind(this)}><HeadImg className="img" userKey={window.LoginUser.Key} /></div>
                            <Menu mode="inline" theme="dark" onClick={this.handleClick.bind(this)}
                                defaultSelectedKeys={[window.hashHistoryNow]}
                                selectedKeys={[this.state.selectedKey]}
                                style={{ flex: "1" }}>
                                <Menu.Item key="/messageView">
                                    <Badge count={this.state.NoReadMessageCount} overflowCount={99}><Icon type="message" /></Badge>
                                    <span className="nav-text">消息</span>
                                </Menu.Item>
                                <Menu.Item key="/orgManager">
                                    <Icon type="solution" /><span className="nav-text">联系人</span>
                                </Menu.Item>
                                {/*<Menu.Item key="folder">
                                    <Icon type="folder" /><span className="nav-text">云文件</span>
                                </Menu.Item>*/}
                            </Menu>
                            <Menu mode="inline" theme="dark" onClick={this.handleClick1.bind(this)}
                                selectedKeys={[]}>
                                <Menu.Item key="editPassword">
                                    <Icon type="edit" /><span className="nav-text">改密码</span>
                                </Menu.Item>
                                <Menu.Item key="setting">
                                    <Icon type="setting" /><span className="nav-text">设置</span>
                                </Menu.Item>
                            </Menu>
                        </aside>

                        <div className="ant-layout-container">
                            {this.props.children}

                        </div>
                    </div>
                    <div className="ant-layout-footer">
                        <Version />
                        <Copyright />
                        <Feedback />
                    </div>
                    <Setting visible={this.state.settingVisible} closeModal={() => this.setState({ settingVisible: false })} />
                    <EditPassword visible={this.state.editPasswordVisible} closeModal={() => this.setState({ editPasswordVisible: false })} />
                    {this.state.loginUserPersonVisible ? <PersonForm
                        visible={this.state.loginUserPersonVisible}
                        userKey={window.LoginUser.Key}
                        handleCancel={this.cancelPersonFormHandle.bind(this)} /> : ""}
                </div>);
        }

    }
}
