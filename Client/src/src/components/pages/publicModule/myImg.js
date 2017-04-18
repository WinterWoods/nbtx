import React, { Component } from 'react';
import { Modal, Button, message, Progress, Icon, Spin } from 'antd';
import './myImg.less';
import Util from '../../mod/util/util.js'
export default class MyImg extends Component {
    constructor(props) {
        super(props);
        this.drop = false;
        this.move = false;
        this.clickleft = 0;
        this.clicktop = 0;
        this.mouseWheelhandle = false;
        this.imgWidth = 0;
        this.upMouseX = 0;
        this.defaultSize = 0;
        this.upMouseY = 0;
        this.myImg = null;
        this.fileServiceInfo = null;
        this.state = {
            modalVisible: false,
            winFileList: null,
            downPath: null,
            size: 0,
            rotate: 0,
            translateX: 0,
            translateY: 0,
            smallLoading: true,
            smallUrl: "",
            bigUrl: "",
            bigLoading: true
        }
    }
    onClick() {
        //渲染前执行
        window.onmousewheel = this.handleMouseWheel.bind(this);
        this.setState({ modalVisible: true, size: this.defaultSize, bigLoading: false });

    }
    handleCancel(e) {
        window.onmousewheel = null;
        this.upMouseX = 0;
        this.upMouseY = 0;
        this.setState({
            modalVisible: false,
            size: this.defaultSize,
            rotate: 0,
            translateX: 0,
            translateY: 0

        });

    }
    componentWillMount() {
        this.myImg = JSON.parse(this.props.msg.Context);
        if (this.myImg && this.myImg.BigWidth) {
            var i = 0;
            while (true) {
                if (document.body.clientWidth * 3 / 4 > this.myImg.BigWidth * (1 + i / 10)) {
                    this.defaultSize = i;
                    break;
                }
                i = i - 2;
            }
        }
        //准备获取图片的真实地址

    }
    componentDidMount() {
        var self = this;
        window.fileManager.getDownServiceForMsgKey({ MsgKey: this.props.msg.Key }).done(function (result) {
            var smallstr = "http://" + result.ServiceIP + ":" + result.ServicePort + "/api/FileManager/GetPicForFileKey?invitation=nbtx&serviceKey=" + result.MessageServiceKey + "&ticket=" + result.QueryKey + "&big=0&key=" + result.FileKey;
            var bigstr = "http://" + result.ServiceIP + ":" + result.ServicePort + "/api/FileManager/GetPicForFileKey?invitation=nbtx&serviceKey=" + result.MessageServiceKey + "&ticket=" + result.QueryKey + "&big=1&key=" + result.FileKey;
            self.fileServiceInfo = result;
            self.setState({ smallUrl: smallstr, bigUrl: bigstr, smallLoading: false, bigLoading: true })
        });
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
    }
    componentDidUpdate(prevProps, prevState) {
        //更新前执行
        var input = this.refs.downInputPic;
        var date = new Date();
        var fileName = Util.timeFormat(date, "yyyyMMddhhmmss") + ".png";
        if (input) {
            if (this.state.fileInfo) {
                input.setAttribute("nwsaveas", fileName);
            }
            else {
                input.setAttribute("nwsaveas", fileName)
            }
        }

    }
    handleMouseDown(e) {
        e.nativeEvent.stopImmediatePropagation();
        window.event.returnValue = false;
        if (this.drop) {
            this.clickleft = window.event.x
            this.clicktop = window.event.y;
            this.move = true;
        }
    }
    handleClickStop(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        console.log("阻止事件");
    }
    handleMouseMove(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (this.move && this.drop) {
            this.state.translateX = window.event.x - this.clickleft + this.upMouseX;
            this.state.translateY = window.event.y - this.clicktop + this.upMouseY;
            this.setState({
                translateX: this.state.translateX,
                translateY: this.state.translateY
            });
        }
    }
    handleMouseUp(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.move = false;
        this.upMouseX = this.state.translateX;
        this.upMouseY = this.state.translateY;
    }
    handleMouseOver(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.drop = true;
    }
    handleMouseOut(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        //当鼠标移除
        this.drop = false;
    }
    handleDragStart(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        window.event.returnValue = false;
    }
    savePic() {

    }
    downHandle(e) {
        return this.refs.downInputPic.click();
    }
    changeHanlde(e) {
        var self = this;
        var path = e.nativeEvent.target.value;
        Util.download(this.props.msg.Key, this.props.msg.Key, e.nativeEvent.target.value, { Key: this.props.msg.Key });
        var winFileList = window.downUpList.getDownUpFile(this.props.msg.Key);
        if (winFileList) {
            this.timer = setInterval(function () {
                winFileList.downPath = path;
                self.setState({ winFileList: winFileList });
                if (winFileList.state == "end") {
                    clearInterval(self.timer);
                    self.timer = null;
                    message.success('下载成功');
                    self.setState({ downPath: path })
                }
            }.bind(this), 1000);
        }
    }
    handleMouseWheel(e) {
        if (e.wheelDelta > 0) {
            this.handleBig();
        }
        else {
            this.handleSmall();
        }
    }
    openDir() {
        nw.Shell.showItemInFolder(window.downUpList.getDownUpFile(this.props.msg.Key).downPath);
    }
    handleBig() {
        this.state.size = this.state.size + 2;
        if (this.state.size > 20)
            this.state.size = 20;
        this.setState({ size: this.state.size });
    }
    handleSmall() {
        this.state.size = this.state.size - 2;
        if (this.state.size < -8)
            this.state.size = -8;
        this.setState({ size: this.state.size });
    }
    handleRotate() {
        this.state.rotate = this.state.rotate + 90;
        if (this.state.rotate > 360)
            this.state.rotate = 0;
        this.setState({ rotate: this.state.rotate });
    }
    handleAddFace() {
        message.info("请期待新功能");
    }
    handleAddCloudDisk() {
        message.info("请期待新功能");
    }
    render() {
        var saveStat = "";
        if (this.state.winFileList) {
            saveStat = <span>{this.state.winFileList.progress}</span>
        }
        var _downUpList = window.downUpList.getDownUpFile(this.props.msg.Key);
        var _transform = "scale(" + (1 + this.state.size / 10) + ") rotate(" + this.state.rotate + "deg) translate(" + this.state.translateX + "px, " + this.state.translateY + "px)";
        var style1 = {
            transform: _transform,
            boxShadow: "0 0 3px #000",
            transition: " width 100ms ease, height 100ms ease;"
        };
        var minWidth = this.myImg && this.myImg.Width ? this.myImg.Width : 0;
        var minHeight = this.myImg && this.myImg.Height ? this.myImg.Height : 0;
        var style = { minWidth: minWidth + 2, minHeight: minHeight + 2 };
        return (<div className="myImg">
            <Spin spinning={this.state.smallLoading}>
                <div style={style} >
                    <img onClick={this.onClick.bind(this)} style={{ minWidth: minWidth, minHeight: minHeight, display: this.state.smallLoading ? "none" : "block" }} className={this.props.className} src={this.state.smallLoading ? "" : this.state.smallUrl} />
                </div>

            </Spin>
            <div className="modalMyImg" style={{ display: this.state.modalVisible ? "flex" : "none" }}>
                <div ref="myBigImgDiv" className="myImgModalPanel" onClick={this.handleCancel.bind(this)}>
                    <Spin spinning={this.state.bigLoading}>
                        <img ref="myBigImg" className="img"
                            onClick={this.handleClickStop.bind(this)}
                            onMouseDown={this.handleMouseDown.bind(this)}
                            onMouseMove={this.handleMouseMove.bind(this)}
                            onMouseUp={this.handleMouseUp.bind(this)}
                            onMouseOver={this.handleMouseOver.bind(this)}
                            onMouseOut={this.handleMouseOut.bind(this)}
                            onDragStart={this.handleDragStart.bind(this)}
                            style={style1} src={this.state.bigLoading ? "" : this.state.bigUrl} />
                    </Spin>
                </div>
                <div className="opts">

                    <div className="btns" onClick={this.handleBig.bind(this)}>
                        <div className="btn">
                            <Icon type="plus-circle-o" />
                        </div>
                        <div className="text">
                            放大
                        </div>
                    </div>
                    <div className="btns" onClick={this.handleSmall.bind(this)}>
                        <div className="btn">
                            <Icon type="minus-circle-o" />
                        </div>
                        <div className="text">
                            缩小
                        </div>
                    </div>
                    <div className="btns" onClick={this.handleRotate.bind(this)}>
                        <div className="btn">
                            <Icon type="reload" />
                        </div>
                        <div className="text">
                            旋转
                        </div>
                    </div>
                    <div className="btns" onClick={this.downHandle.bind(this)}>
                        <div className="btn">
                            <Icon type="arrow-down" />
                        </div>
                        <div className="text">
                            下载原图
                        </div>
                    </div>
                    <div className="btns" onClick={this.handleAddFace.bind(this)}>
                        <div className="btn">
                            <Icon type="smile-o" />
                        </div>
                        <div className="text">
                            添加到表情
                        </div>
                    </div>
                    <div className="btns" onClick={this.handleAddCloudDisk.bind(this)}>
                        <div className="btn">
                            <Icon type="cloud-upload-o" />
                        </div>
                        <div className="text">
                            转存到云盘
                        </div>
                    </div>
                    <input ref="downInputPic" onChange={this.changeHanlde.bind(this)} style={{ display: "none" }} type="file" />
                </div>
                <div className="closeBtn" onClick={this.handleCancel.bind(this)}>
                    <Icon type="close" />
                </div>
            </div>
        </div>
        );
    }
}
MyImg.propTypes = {};
MyImg.defaultProps = {
    className: "",
    msg: "",
    type: "0"
};