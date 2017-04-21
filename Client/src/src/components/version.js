import React, { Component } from 'react';
import { Button, Popover, Icon, Tooltip, Progress, Badge, message, Modal } from 'antd';

import './version.less'

import Util from './mod/util/util.js'
export default class Version extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            versionModalVisible: false,
            isHavNewVersion: false,
            upSelect: false,
            appVersionExe: {}
        };
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行
        this.versionSelect();
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentWillUnmount() {
        //准备卸载前执行
    }

    handlesetUpOk() {
        nw.Shell.openItem("lastVersion.exe");
        setTimeout(function () {
            var win = nw.Window.get();
            win.close();
        }, 1000);
    }
    handleEsc() {
        this.setState({ versionModalVisible: false });
    }
    versionSelect() {
        var self = this;
        this.setState({ upSelect: true });
        window.fileManager.getVersion()
            .done(function (result) {
                if (result.Version != window.config.Version) {
                    self.setState({ isHavNewVersion: true, upSelect: false });
                    //有新版本,必须要升级
                    Util.download("lastVersion.exe", "", "lastVersion.exe", {}, "/api/FileManager/DownLastVersionExe");
                    var downFile = window.downUpList.getDownUpFile("lastVersion.exe");
                    console.log(downFile);
                    self.setState({ appVersionExe: downFile, appVersionMsg: result.Msg });
                    var timers = setInterval(function () {
                        console.log(downFile);
                        if (downFile.state == "end") {
                            clearInterval(timers);
                            timers = null;
                            nw.Window.get().show();
                            nw.Window.get().requestAttention(true);
                            self.setState({ versionModalVisible: true });
                        }
                        self.setState({ appVersionExe: downFile });
                    }, 1000)
                }
                else{
                    self.setState({ isHavNewVersion: false });
                }
            });
    }
    versionDownProgress() {
        this.setState({ versionModalVisible: true });
    }
    render() {
        return (
            <div className="versionAPPInfoPanel">
                <div>
                    <Badge dot={this.state.isHavNewVersion}>
                        {this.state.isHavNewVersion ?
                            this.state.appVersionExe.state == "end" ? <Tooltip title="下载完成">
                                <a onClick={this.versionDownProgress.bind(this)}>新版本下载完成,点击安装</a>
                            </Tooltip> : <Tooltip title="正在下载新版本">
                                    <a onClick={this.versionDownProgress.bind(this)}>正在下载新版本...</a>
                                </Tooltip>
                            :
                            <Tooltip title="点击检测是否有新版本">
                                {this.state.upSelect ? "正在检查..." : <a onClick={this.versionSelect.bind(this)}>版本:{window.config.Version}</a>}
                            </Tooltip>}

                    </Badge>
                </div>
                {this.state.isHavNewVersion ?
                    <Modal
                        visible={this.state.versionModalVisible}
                        wrapClassName="versionUPModal"
                        title="发现新版本"
                        onOk={this.handlesetUpOk.bind(this)}
                        closable={true}
                        footer={[
                            <Button key="esc" onClick={this.handleEsc.bind(this)}>
                                最小化</Button>,
                            <Button key="submit" type="primary" disabled={this.state.appVersionExe.state != "end"} onClick={this.handlesetUpOk.bind(this)}>
                                安装</Button>
                        ]}
                        >
                        <div className="panel">
                            <div className="progress">
                                <Progress percent={this.state.appVersionExe.progress} status="active" />
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <pre>{this.state.appVersionMsg}</pre>
                            </div>
                        </div>
                    </Modal> : ""}
            </div>
        );
    }
}
Version.propTypes = {};
Version.defaultProps = {
};