import React, { Component } from 'react';
import { render } from 'react-dom';
import { Popover, Icon, Progress, message, Tooltip } from 'antd';

import "./sendPic.less"
import Util from '../../mod/util/util.js'
import MyImg from '../publicModule/myImg.js'

export default class SendPic extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.fileInfo = null;
        this.state = {
            reload: false,
            winFileInfo: null
        }
    }
    componentWillMount() {
        //渲染前执行
        var _downUpList = window.downUpList.getDownUpFile(this.props.msg.Key);
        this.setState({ reload: true, winFileInfo: _downUpList });
        //如果文件已经上传完成
        if (this.props.msg.FileUpOver)
            this.fileInfo = JSON.parse(this.props.msg.Context);
    }
    beginRender() {
        if (this.timer == null) {
            this.timer = setInterval(function () {
                var _downUpList = window.downUpList.getDownUpFile(this.props.msg.Key);
                if (_downUpList == null) {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.setState({ reload: false, winFileInfo: null });
                }
                else {
                    if (_downUpList.state == "end" || _downUpList.state == "abort") {
                        if (_downUpList.type == "up" && _downUpList.state == "end") {
                            //如果上传完成,需要更改文件信息
                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!", _downUpList);
                            this.fileInfo = { Name: _downUpList.fileName, Size: _downUpList.fileSize };
                        }
                        clearInterval(this.timer);
                        this.timer = null;
                        this.setState({ reload: true, winFileInfo: _downUpList });
                    }
                    else {
                        this.setState({ reload: false, winFileInfo: _downUpList });
                    }
                }

            }.bind(this), 1000);
        }
    }
    endRender() {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    componentDidMount() {
        var self = this;
        this.beginRender();

        //渲染完成后执行
        //循环找到该条消息记录的上传进度
        //首先检查全局变量是否有上传或下载的进度,如果存在的话就进行渲染上传或者下载
        //如果不存在则渲染成正常状态啊
        // var _downUpList = window.downUpList.getDownUpFile(this.props.msg.Key);
        // if (_downUpList) {
        //     if (this.props.msg.MsgType == "2") {
        //         this.isLoadHostPic = true;
        //     }
        //     //如果存在全局变量
        //     //存在这个文件,进行渲染变量
        //     this.timer = setInterval(function () {
        //         var winFileList = window.downUpList.getDownUpFile(self.props.msg.Key);
        //         if (winFileList.state == "end") {
        //             self.setState({ winFileList: winFileList });
        //             clearInterval(self.timer);
        //             self.timer = null;
        //             if (winFileList.file && winFileList.file.name)
        //                 self.setState({ fileInfo: { Name: winFileList.file.name, Size: winFileList.file.size } });
        //         }
        //         else if (winFileList.state == "abort") {
        //             self.setState({ winFileList: null });
        //             clearInterval(self.timer);
        //             self.timer = null;
        //         }
        //         else {
        //             self.setState({ winFileList: winFileList });
        //         }
        //     }.bind(this), 1000);
        // }
        // else {
        //     self.setState({ noUPOver: true })
        // }
        //如果是文件的话,去后台拉去文件信息,并渲染为文件的正常状态
        //如果文件上传完成的话
        // if (this.props.msg.FileUpOver && this.props.msg.MsgType == "3") {
        //     var Context = JSON.parse(this.props.msg.Context);
        //     self.setState({ fileInfo: Context });
        // }
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理

        if (this.props.msg != nextProps.msg) {
        }
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行

    }
    componentDidUpdate(prevProps, prevState) {
        var self = this;
        if (this.props.msg.MsgType == "2") {
            if (self.state.winFileInfo != null && this.refs.messageContextImg) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = this.refs.messageContextImg;
                    img.src = e.target.result;
                }.bind(this);
                reader.readAsDataURL(self.state.winFileInfo.file);
            }
        }

        var input = this.refs.downInput;
        if (input) {
            if (this.fileInfo) {
                input.setAttribute("nwsaveas", this.fileInfo.Name);
            }
            else {
                input.setAttribute("nwsaveas", this.state.winFileInfo.file.name)
            }
        }

    }
    componentWillUnmount() {
        //准备卸载前执行
        clearInterval(this.timer);
        this.timer = null;
    }
    downHandle(e) {
        this.downKey = null;
        return this.refs.downInput.click();
    }
    changeHanlde(e) {
        window.downUpList.clear(this.props.msg.Key);
        Util.download(this.props.msg.Key, this.props.msg.Key, e.nativeEvent.target.value, { Key: this.props.msg.Key });

        this.beginRender();
        // var winFileList = window.downUpList.getDownUpFile(this.downKey);
        // if (winFileList) {
        //     this.timer = setInterval(function () {
        //         winFileList.downPath = this.downPath;
        //         if (winFileList.state == "end") {
        //             self.setState({ winFileList: winFileList });
        //             clearInterval(self.timer);
        //             self.timer = null;
        //         }
        //         else if (winFileList.state == "abort") {
        //             self.setState({ winFileList: null });
        //             clearInterval(self.timer);
        //             self.timer = null;
        //         }
        //         else {
        //             self.setState({ winFileList: winFileList });
        //         }
        //     }.bind(this), 1000);
        // }
    }
    escDownHandle() {
        self = this;
        window.downUpList.abort(this.props.msg.Key)
        // if (this.downKey) {
        //     clearInterval(this.timer);
        //     this.timer = null;
        //     window.downUpList.abort(this.downKey);
        //     var winFileList = window.downUpList.getDownUpFile(this.downKey);
        //     self.setState({ winFileList: winFileList });
        // }
        // else {
        //     window.downUpList.abort(self.props.msg.Key);
        //     clearInterval(this.timer);
        //     this.timer = null;
        //     this.props.delFileSendMessage(this.props.msg);
        // }


    }
    openDownHandle() {
        var winFileList = window.downUpList.getDownUpFile(this.props.msg.Key);
        nw.Shell.showItemInFolder(winFileList.filePath);
    }
    renderEndFile(str) {

        return (<div className="fileContent">
            <div className="fileIco"><img className="filePng" src={"img/" + Util.getFileExt(this.fileInfo.Name) + ".png"} /></div>
            <div className="fileinfo">
                <div className="fileinfoName"><Tooltip mouseLeaveDelay={0} title={this.fileInfo.Name}><span>{this.fileInfo.Name}</span></Tooltip></div>
                <div className="fileinfSize">{Util.getFileSize(this.fileInfo.Size)}</div>
                <div className="fileinfOpts">
                    <a onClick={this.downHandle.bind(this)}>下载</a>
                    <input ref="downInput" onChange={this.changeHanlde.bind(this)} style={{ display: "none" }} type="file" />
                </div>

            </div>
        </div>);
    }
    hanldeUPDeleMsg() {
        window.downUpList.abort(this.props.msg.Key);
        this.props.delFileSendMessage(this.props.msg);
    }
    renderFile() {
        //文件的渲染,文件上传完,并且必须没有下载
        if (this.props.msg.FileUpOver && this.state.winFileInfo == null) {
            return this.renderEndFile();
        }
        else {
            if (this.state.winFileInfo == null) {
                //直接干掉消息
                return (<div style={{ color: "black" }}>
                    文件未上传成功<a onClick={this.hanldeUPDeleMsg.bind(this)}>删除</a>
                </div>);
            }
            if (this.state.winFileInfo.type == "up") {

                return (
                    <div className="fileContent">
                        <div className="fileIco"><img className="filePng" src={"img/" + Util.getFileExt(this.state.winFileInfo.file.name) + ".png"} /></div>
                        <div className="fileinfo">
                            <div className="fileinfoName"><Tooltip mouseLeaveDelay={0} title={this.state.winFileInfo.file.name}><span>{this.state.winFileInfo.file.name}</span></Tooltip></div>
                            <div className="fileinfSize">{Util.getFileSize(this.state.winFileInfo.file.size)}</div>
                            {this.state.winFileInfo.state == "begin" ?
                                <div className="progress">
                                    <Progress percent={this.state.winFileInfo.progress} showInfo={false} />
                                    <a onClick={this.hanldeUPDeleMsg.bind(this)}><Icon type="cross-circle" /></a>
                                </div> : ""}
                            {this.state.winFileInfo.state == "end" ? <div className="fileinfOpts">
                                <a onClick={this.downHandle.bind(this)}>下载</a>
                                <input ref="downInput" onChange={this.changeHanlde.bind(this)} style={{ display: "none" }} type="file" />
                            </div> : ""}

                            {this.state.winFileInfo.state != "end" && this.state.winFileInfo.state != "begin" ?
                                <div className="otherstate">
                                    <div className="infostate">
                                        {this.state.winFileInfo.state == "wait" ? "准备上传" : ""}
                                        {this.state.winFileInfo.state == "md5" ? "正在检测文件" : ""}
                                        {this.state.winFileInfo.state == "error" ? "文件上传错误" : ""}
                                    </div>
                                    <a onClick={this.hanldeUPDeleMsg.bind(this)}><Icon type="cross-circle" /></a>
                                </div> : ""}
                        </div>
                    </div>
                );
            }
            else {
                //文件下载渲染
                console.log(this.state.winFileInfo, this.fileInfo);
                //文件上传渲染
                return (
                    <div className="fileContent">
                        <div className="fileIco"><img src={"img/" + Util.getFileExt(this.fileInfo.Name) + ".png"} /></div>
                        <div className="fileinfo">
                            <div className="fileinfoName">{this.fileInfo.Name}</div>
                            <div className="fileinfSize">{Util.getFileSize(this.fileInfo.Size)}</div>
                            {this.state.winFileInfo.state == "begin" ?
                                <div className="progress">
                                    <Progress percent={this.state.winFileInfo.progress} showInfo={false} />
                                    <a onClick={this.escDownHandle.bind(this)}><Icon type="cross-circle" /></a>
                                </div> : ""}
                            {this.state.winFileInfo.state == "end" ?
                                <div className="fileinfOpts">
                                    <a onClick={this.downHandle.bind(this)}>下载</a>
                                    <a onClick={this.openDownHandle.bind(this)}>打开文件夹</a>
                                    <input ref="downInput" onChange={this.changeHanlde.bind(this)} style={{ display: "none" }} type="file" />
                                </div>
                                : ""}

                            {this.state.winFileInfo.state != "begin" && this.state.winFileInfo.state != "end" ?
                                <div className="fileinfOpts">
                                    <a onClick={this.downHandle.bind(this)}>下载</a>
                                    {this.state.winFileInfo.state == "wait" ? "准备下载" : ""}
                                    {this.state.winFileInfo.state == "error" ? "文件下载错误" : ""}
                                    {this.state.winFileInfo.state == "abort" ? "取消下载" : ""}
                                    {this.state.winFileInfo.state == "getService" ? "正在获取下载服务器" : ""}
                                    <input ref="downInput" onChange={this.changeHanlde.bind(this)} style={{ display: "none" }} type="file" />
                                </div>
                                : ""
                            }
                        </div>
                    </div>
                );
            }
        }
    }
    render() {
        //图片的渲染,判断是否是上传完成,如果已经上传完成
        if (this.props.msg.MsgType == "2") {
            if (this.props.msg.FileUpOver) {
                return (<MyImg className="messageContextImg" msg={this.props.msg} />);
            }
            else {
                if (this.state.winFileInfo == null) {
                    //直接干掉消息
                    return (<div style={{ color: "black" }}>
                        图片未上传成功<a onClick={this.hanldeUPDeleMsg.bind(this)}>删除</a>
                    </div>);
                }
                //winFileInfo
                return (<div className="sendPicInfo">
                    {this.state.winFileInfo.state == "end" ?
                        <MyImg className="messageContextImg" msg={this.props.msg} /> :
                        <img className="messageContextImg" ref="messageContextImg" />}

                    {this.state.winFileInfo.state == "begin" ?
                        <div className="progress">
                            <Progress percent={this.state.winFileInfo.progress} showInfo={false} />
                            <a onClick={this.hanldeUPDeleMsg.bind(this)}><Icon type="cross-circle" /></a>
                        </div> : ""}
                    {this.state.winFileInfo.state != "end" && this.state.winFileInfo.state != "begin" ?
                        <div className="otherstate">
                            <div className="infostate">
                                {this.state.winFileInfo.state == "wait" ? "准备上传" : ""}
                                {this.state.winFileInfo.state == "md5" ? "正在检测图片" : ""}
                                {this.state.winFileInfo.state == "error" ? "图片上传错误" : ""}

                            </div>
                            <a onClick={this.hanldeUPDeleMsg.bind(this)}><Icon type="cross-circle" /></a>
                        </div> : ""}
                </div>);
            }
        }
        else {
            return this.renderFile();
        }
    }
}
SendPic.propTypes = {};
SendPic.defaultProps = {
    msg: {},
    delFileSendMessage: function (item) { }
};