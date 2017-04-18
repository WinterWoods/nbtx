import React, { Component } from 'react';
import { Input, Button, Checkbox, Row, Col, Icon, message, Modal, Progress } from 'antd';
const confirm = Modal.confirm;
import './login.less';
import Util from './mod/util/util.js'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgisShow: 'none',
      UserName: "",
      password: "",
      password1: "",
      appVersionExe: {},
      versionModalVisible: false,
      appVersionMsg: ""
    };
  }
  componentDidMount() {

    // this.props.form.setFieldsValue({
    //   UserName: '',
    //   Password: ''
    // });
    // var self = this
    // var constraints = {
    //     video: {
    //         mandatory: {
    //             maxWidth: window.screen.width,
    //             maxHeight: window.screen.height,
    //             chromeMediaSource: 'screen'
    //         }
    //     }
    // }
    // navigator.getUserMedia_ = (navigator.getUserMedia
    //     || navigator.webkitGetUserMedia
    //     || navigator.mozGetUserMedia
    //     || navigator.msGetUserMedia)
    // // constraints =  {video: true, audio: true}
    // console.log(constraints, navigator, window.navigator)
    // navigator.webkitGetUserMedia(constraints, function (localSource) {
    //     console.log(localSource)
    //     this.refs.vd.src = URL.createObjectURL(localSource)
    //     this.refs.vd.play()
    //     setTimeout(function () {
    //         var canvas = this.refs.canvas
    //         var ctx = canvas.getContext('2d')
    //         ctx.drawImage(this.refs.vd, 0, 0)
    //         // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
    //         this.refs.img.src = canvas.toDataURL('image/webp')
    //         nw.Window.get().enterFullscreen()
    //         this.setState({imgisShow:"block"})

    //     }.bind(this), 1000)

    // }.bind(this), function (err) {
    //     console.log('error', err)
    // })
    // <video ref="vd" style={{ display: "none" }}></video>
    //         <img onClick={this.testonClick.bind(this)} style={{ display: this.state.imgisShow }} className="testimg" width="500" height="500" ref="img"></img>
    //         <canvas ref="canvas" style={{ display: "none" }}></canvas>

  }
  componentWillReceiveProps(nextProps) {
    //接受到新的数据处理
    var self = this;
    if (nextProps.isHasNet) {
      // window.fileManager.getVersion()
      //   .done(function (result) {
      //     if (result.Version != window.config.Version) {
      //       //有新版本,必须要升级
      //       Util.download("lastVersion.exe", "", "lastVersion.exe", {}, "/api/FileManager/DownLastVersionExe");
      //       var downFile = window.downUpList.getDownUpFile("lastVersion.exe");
      //       console.log(downFile);
      //       self.setState({ versionModalVisible: true, appVersionExe: downFile, appVersionMsg: result.Msg });
      //       var timers = setInterval(function () {
      //         console.log(downFile);

      //         if (downFile.state == "end") {
      //           clearInterval(timers);
      //           timers = null;
      //           nw.Window.get().show();
      //           nw.Window.get().requestAttention(true);
      //         }
      //         self.setState({ appVersionExe: downFile });
      //       }, 1000)
      //     }
      //   });
    }
  }
  testonClick() {
    nw.Window.get().leaveFullscreen();
    this.setState({ imgisShow: 'none' });
  }
  handleSubmit(e) {
    e.preventDefault();
    var self = this;
    if (this.state.UserName == "") {
      message.error("请输入用户名");
      return
    }
    if (this.state.password == "") {
      message.error("请输入密码");
      return
    }


    if (self.props.isHasNet)
      self.props.handleSubmit({ LoginName: this.state.UserName, Password: this.state.password });
  }
  handleOk() { }
  handleCancel() { }
  onKeyDown(e) {
    if (e.keyCode == '13')
      this.handleSubmit(e);
  }
  min() {
    var win = nw.Window.get();
    win.minimize();
  }
  close() {
    var win = nw.Window.get();
    win.close();
  }
  componentDidUpdate(nextProps, nextState) {
    //更新前执行

  }
  onKeyDownPassword(e) {
    if (e.key == "Backspace") {
      var pass = this.state.password.substring(0, this.state.password.length - 1);
      var passL = "";
      for (var i = 0; i < pass.length; i++) {
        passL = passL + "*";
      }
      this.setState({ password: pass, password1: passL });
    }
    if (e.keyCode == '13') {
      this.handleSubmit(e);
    }
  }
  hanldekeyPress(e) {
    var pass = this.state.password;
    pass = pass + e.key;
    var passL = "";
    for (var i = 0; i < pass.length; i++) {
      passL = passL + "*";
    }
    this.setState({ password: pass, password1: passL });
  }
  render() {
    return (
      <div className='loginPanel'>
        <div className='drayTitle'>
          <a><Icon onClick={this.min.bind(this)} type='minus' /></a>
          <a><Icon onClick={this.close.bind(this)} type='cross' /></a>
        </div>
        <div className='loginTitle'>
          内部通讯工具
        </div>
        <div className='loginForm'>
          <div className="row">
            <div className="lable">
              <span> 账号：</span>
            </div>
            <div className="input">
              <Input value={this.state.UserName} onChange={function (value) { this.setState({ UserName: value.target.value }); }.bind(this)} placeholder='请输入警号' autoComplete={"off"} addonBefore={<Icon type="user" />} onKeyDown={this.onKeyDown.bind(this)} />
            </div>
          </div>
          <div className="row">
            <div className="lable">
              <span> 密码：</span>
            </div>
            <div className="input">
              <Input value={this.state.password1} readOnly onKeyPress={this.hanldekeyPress.bind(this)} onKeyDown={this.onKeyDownPassword.bind(this)} placeholder='请输入密码' autoComplete={"off"} addonBefore={<Icon type="lock" />} />
            </div>
          </div>
          <div className="row">
            <Button
              type='primary'
              loading={this.props.isLoading}
              disabled={!this.props.isHasNet}
              onClick={this.handleSubmit.bind(this)}>
              登录
                </Button>
          </div>
          <div className="row">
            <span style={{ marginLeft: 8 }}>{!this.props.isHasNet ? <span>网络无法连接，请 <a href='javascript:window.location.reload()'>重试</a></span> : ''}</span>
          </div>
        </div>
        <div className='footer'>
          内部安全通讯 版权所有 ©
          {new Date().getFullYear()}时予东 18937885169
        </div>
      </div>
    );
  }
};

Login.propTypes = {};
Login.defaultProps = {
  handleSubmit: function (values) { },
  isLoading: false,
  isHasNet: false
};
