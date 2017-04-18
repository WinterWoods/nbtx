import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon, Button, Tooltip } from 'antd';

import "./welcome.less"

import Util from '../../mod/util/util.js'
export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            icoClass: ""
        }
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行
        this.reload();
    }
    reload() {
        var date = new Date().getHours();
        if (date <= 12) {
            this.setState({ text: "早上好，新的一天开始了，加油，加油。", icoClass: "morning" });
        }
        else if (date > 12 && date <= 18) {
            this.setState({ text: "下午好，喝杯茶吧，让精神抖擞起来。", icoClass: "noon" });
        }
        else {
            this.setState({ text: "已经很晚了，早点休息吧。", icoClass: "night" });
        }
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
        this.reload();
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    render() {
        return (<div className="welcome" >
            <div className="welcomePng">

            </div>
            <div className={"welcomeText " + this.state.icoClass}>
                {this.state.text}
            </div>
        </div>);
    }
}
FileList.propTypes = {};
FileList.defaultProps = {
};