import React, { Component } from 'react';
import { render } from 'react-dom';
import { Modal, Input, Switch, message } from 'antd';
import './setting.less';

import Util from '../mod/util/util.js'
export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.showWincode = "";

        this.state = {
            swithValue: false,
            showWin: "",
            copy: ""
        }
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        var self = this;

        //渲染完成后执行
        //获取注册表是否有自动启动
        console.log(window.process.cwd());
        Util.AutoRunGet(function (flag) {
            self.setState({ swithValue: flag })
        })
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        if (window.userConfig)
            this.setState({ showWin: window.userConfig.ShowWin, copy: window.userConfig.CopySc, swithValue: window.userConfig.AutoRun });
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    handleOk() {
        var self = this;

        window.userConfig.ShowWin = this.state.showWin;
        window.userConfig.CopySc = this.state.copy;
        window.userConfig.AutoRun = this.state.swithValue;

        window.userManager.settingConfigSet(window.userConfig)
            .done(function (result) {
                //注册快捷键
                Util.configSet(window.userConfig);
                self.props.closeModal();
            });


    }
    handleCancel() {
        this.props.closeModal();
    }
    onChangeSwitch() {
        //如果要添加
        var self = this;

        self.setState({ swithValue: !self.state.swithValue });



    }
    handleshowWinKeyDown() {
        var self = this;
        var isctrlKey = "";
        var isaltKey = "";
        var isshiftKey = "";
        this.showWincode = "";
        if (event.ctrlKey) {
            isctrlKey = "Ctrl+";
        }
        if (event.altKey) {
            isaltKey = "Alt+";
        }
        if (event.shiftKey) {
            isshiftKey = "Shift+";
        }
        if (event.code.substring(0, 3) == "Key") {
            this.showWincode = event.code.substring(3, 4);
        }
        if (!(isctrlKey == "" && isaltKey == "" && isshiftKey == "")) {
            self.setState({ showWin: isctrlKey + isaltKey + isshiftKey + this.showWincode });
        }

    }
    handleshowWinKeyUp() {
        var self = this;
        if (this.showWincode == "")
            self.setState({ showWin: "" });
    }

    handlecopyKeyDown() {
        var self = this;
        var isctrlKey = "";
        var isaltKey = "";
        var isshiftKey = "";
        this.copycode = "";
        if (event.ctrlKey) {
            isctrlKey = "Ctrl+";
        }
        if (event.altKey) {
            isaltKey = "Alt+";
        }
        if (event.shiftKey) {
            isshiftKey = "Shift+";
        }
        if (event.code.substring(0, 3) == "Key") {
            this.copycode = event.code.substring(3, 4);
        }
        if (!(isctrlKey == "" && isaltKey == "" && isshiftKey == "")) {
            self.setState({ copy: isctrlKey + isaltKey + isshiftKey + this.copycode });
        }

    }
    handlecopyKeyUp() {
        var self = this;
        if (this.copycode == "")
            self.setState({ copy: "" });
    }
    render() {
        return (<Modal title="设置" visible={this.props.visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            wrapClassName="settingModal"
            width={365}
            >
            <div className="panel">
                <div className="one">
                    <div className="lable">
                        激活窗口快捷键
                    </div>
                    <div className="context">
                        <Input value={this.state.showWin} onKeyUp={this.handleshowWinKeyUp.bind(this)} onKeyDown={this.handleshowWinKeyDown.bind(this)} placeholder="请定义快捷键" />
                    </div>
                </div>
                <div className="one">
                    <div className="lable">
                        截图快捷键
                    </div>
                    <div className="context">
                        <Input value={this.state.copy} onKeyUp={this.handlecopyKeyUp.bind(this)} onKeyDown={this.handlecopyKeyDown.bind(this)} placeholder="请定义快捷键" />
                    </div>
                </div>
                <div className="one">
                    <div className="lable">
                        开机自动启动
                    </div>
                    <div className="context">
                        <Switch checked={this.state.swithValue} onChange={this.onChangeSwitch.bind(this)} />
                    </div>
                </div>
            </div>

        </Modal>);
    }
}

Setting.propTypes = {};
Setting.defaultProps = {
    visible: false,
    closeModal: function () { }
};