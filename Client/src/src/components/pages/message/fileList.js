import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon, Button, Tooltip, Progress } from 'antd';

import "./fileList.less"

import Util from '../../mod/util/util.js'
export default class FileList extends Component {
    constructor(props) {
        super(props);
        this.downListKey = [];
        this.timer = null;
        this.downMsgKey = null;
        this.state = {
            fileList: [],
            state: false
        }
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行
        var self = this;
        this.reloadFileList(this.props.friendInfo);
        this.timer = setInterval(function () {
            self.setState({ state: true });
        }.bind(this), 1000);
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        if (nextProps.friendInfo != this.props.friendInfo) {
            this.reloadFileList(nextProps.friendInfo);
        }
    }
    reloadFileList(info) {
        var self = this;
        window.msgManager.messageListFileQuery({ SendKey: info.FriendKey, Type: info.Type })
            .done(function (result) {
                self.setState({ fileList: result });
            });
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentDidUpdate(prevProps, prevState) {

    }
    componentWillUnmount() {
        //准备卸载前执行
        clearInterval(this.timer);
        this.timer = null;
    }

    downHandle(item) {
        this.downMsgKey = item.MsgKey;
        var input = this.refs.downInputPic;
        if (input) {
            input.onChange = null;
            input.setAttribute("nwsaveas", item.Name);
            input.onChange = this.changeHanlde.bind(this);
        }

        return this.refs.downInputPic.click();
    }
    changeHanlde(e) {
        if (e.nativeEvent.target.value == "") return;
        this.downListKey[this.downMsgKey] = true;
        var self = this;
        var path = e.nativeEvent.target.value;
        Util.download(this.downMsgKey, this.downMsgKey, path, { Key: this.downMsgKey });

        this.downMsgKey = null;
    }
    escDown(item) {
        window.downUpList.abort(item.key);
    }
    hanldeOpenDir(item) {
        nw.Shell.showItemInFolder(item.downPath);
    }
    renderFileOne(item) {
        var winFileList = window.downUpList.getDownUpFile(item.MsgKey);
        return (<div className="fileOne" key={"filePanel" + item.Key}>
            <div className="showInfo">
                <div className="fileIco">
                    <img className="icoPng" src={"img/" + Util.getFileExt(item.Name) + ".png"} />
                </div>
                <div className="fileInfo">
                    <Tooltip title={item.Name}><div className="fileName"><span>{item.Name}</span></div></Tooltip>
                    <div className="fileOther">
                        <div className="fileTime">{Util.timeFormat(item.AddTime, "yyyy-MM-dd")}</div>
                        <div className="fileSize">{Util.getFileSize(item.FileSize)}</div>
                        <div className="fileUser">{item.AddUser}</div>
                    </div>
                </div>
                <div className="fileOps">
                    <Button onClick={this.downHandle.bind(this, item)} type="ghost">下载</Button>
                </div>
            </div>
            {winFileList && winFileList.state == "begin" ?
                <div className="progress">
                    <div className="proInput">
                        <Progress percent={winFileList.progress} showInfo={false} />
                    </div>
                    <div className="openDir">
                        <a onClick={this.escDown.bind(this, winFileList)}><Icon type="close-circle-o" /></a>
                    </div>
                </div> : ""}
            {winFileList && winFileList.state == "end" ?
                <div className="progress">
                    <div className="proInput">
                        下载完成
                    </div>
                    <div className="openDir">
                        <a onClick={this.hanldeOpenDir.bind(this, winFileList)}>打开文件夹</a>
                    </div>
                </div> : ""}
        </div>);

    }
    renderFileList() {
        if (this.state.fileList.length > 0) {
            //渲染列表
            var lastMonth = "";
            return this.state.fileList.map(function (item, index) {
                var nowMonth = Util.timeFormat(item.AddTime, "yyyy年MM月");
                if (lastMonth != nowMonth) {
                    lastMonth = nowMonth;
                    //渲染月份
                    return (<div className="fileGroup">
                        <div className="monthPanel">{nowMonth}</div>
                        {this.renderFileOne(item)}
                    </div>);
                }
                else {
                    return (<div className="fileGroup">
                        {this.renderFileOne(item)}
                    </div>);
                }
            }.bind(this));

        }
        else {
            return <div className="empty"><Icon type="cloud-o" /><div className="text">这个文件夹是空的</div></div>;
        }
    }
    render() {
        return (<div className="fileList" >
            {this.renderFileList()}
            <input ref="downInputPic" onChange={this.changeHanlde.bind(this)} style={{ display: "none" }} type="file" />
        </div>);
    }
}
FileList.propTypes = {};
FileList.defaultProps = {
    friendInfo: {}
};