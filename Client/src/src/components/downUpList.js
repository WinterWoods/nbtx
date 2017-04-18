import React, { Component } from 'react';
import { Button, Popover, Icon, Tooltip, Progress } from 'antd';

import './downUpList.less'

import Util from './mod/util/util.js'
export default class DownUpList extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            visible: false,
            reload: false
        };
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行
        if (this.timer == null) {
            this.timer = setInterval(function () {
                this.setState({ reload: true });

            }.bind(this), 1000);
        }

    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentWillUnmount() {
        //准备卸载前执行
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    escDownUp(item) {
        window.downUpList.abort(item.key);
    }
    openDIr(item) {
        nw.Shell.showItemInFolder(item.filePath);
    }
    clearList() {
        window.downUpList.clearList();
    }
    renderOne(data) {
        return data.map(function (item, index) {
            if (item == null) return "";
            if (item.key == "lastVersion.exe") return "";
            var stat = "";
            var name = "";
            var size = "";
            var opts = "";
            if (item.type == "up") {
                name = item.file.name;
                size = item.file.size;
                switch (item.state) {
                    case "begin":
                        stat = "正在上传";
                        opts = <Tooltip title={"取消"}><a onClick={this.escDownUp.bind(this, item)}> <Icon type="close-circle-o" /></a></Tooltip>
                        break;
                    case "end":
                        stat = "上传完成";
                        break;
                    case "error":
                        stat = "上传错误";
                        break;
                    case "wait":
                        stat = "等待上传";
                        break;
                    case "abort":
                        stat = "取消上传";
                        break;
                }
            }
            else {
                name = item.filePath;
                size = item.size;
                switch (item.state) {
                    case "begin":
                        stat = "正在下载";
                        opts = <Tooltip title={"取消"}><a onClick={this.escDownUp.bind(this, item)}> <Icon type="close-circle-o" /></a></Tooltip>
                        break;
                    case "end":
                        stat = "下载完成";
                        opts = <Tooltip title={"打开"}><a onClick={this.openDIr.bind(this, item)}> <Icon type="folder-open" /></a></Tooltip>
                        break;
                    case "error":
                        stat = "下载错误";
                        break;
                    case "wait":
                        stat = "等待下载";
                        break;
                    case "abort":
                        stat = "取消下载";
                        break;
                }
            }
            return (<div className="fileOne">
                <div className="imgDiv">
                    <img className="img" src={"img/" + Util.getFileExt(name) + ".png"} />
                </div>
                <div className="info">
                    <div className="name">
                        <Tooltip title={"取消"}><span>{name}</span></Tooltip>
                    </div>
                    {item.state == "begin" ?
                        <div className="progress">
                            <Progress percent={item.progress} strokeWidth={5} showInfo={false} />
                        </div> : ""
                    }

                    <div className="other">
                        <div className="state">
                            {stat}
                        </div>
                        <div className="size">
                            {Util.getFileSize(size)}
                        </div>
                    </div>
                </div>
                <div className="opts">
                    {opts}
                </div>
            </div>)
        }.bind(this))

    }
    renderList() {
        if (window.downUpList.length == 0 || (window.downUpList.length == 1 && window.downUpList[0].key == "lastVersion.exe")) {
            return (<div className="winDownUpListPanel null">
                暂时没有上传/下载的文件
            </div>)
        }
        else {
            return (<div className="winDownUpListPanel">
                <div className="title">
                    <div className="titlediv">

                    </div>
                    <div className="titlediv text">
                        文件传输
                </div>
                    <div className="titlediv clearBtn">
                        <a onClick={this.clearList.bind(this)}> 清空记录</a>
                    </div>
                </div>
                <div className="list">
                    {this.renderOne(window.downUpList)}
                </div>
            </div>);
        }


    }
    handleVisibleChange(visible) {
        this.setState({ visible });
    }
    render() {
        return (
            <Popover overlayClassName="downUpPanel" placement="bottom" content={this.renderList()} title="" trigger="click"
                visible={this.state.visible} onVisibleChange={this.handleVisibleChange.bind(this)}
                >
                <div className="downUpBtnPanel">
                    <Tooltip mouseLeaveDelay={0} title={"上传/下载"}>
                        <a className="downUpBtnA">
                            <Icon type="retweet" />
                        </a>
                    </Tooltip>
                </div>
            </Popover>
        );
    }
}
DownUpList.propTypes = {};
DownUpList.defaultProps = {
    groupInfo: {},
    visiblePanel: false,
    groupNameGet: function (key) { },
    reloadGroupInfo: function (key) { }
};