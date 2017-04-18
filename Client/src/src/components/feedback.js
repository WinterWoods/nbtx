import React, { Component } from 'react';
import { Button, Popover, Icon, Tooltip, Progress, Badge, message } from 'antd';

import './feedback.less'

import Util from './mod/util/util.js'
export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            visible: false,
            isHavNewVersion: false,
            upSelect: false
        };
    }
    componentWillMount() {
        //渲染前执行
    }
    componentDidMount() {
        //渲染完成后执行

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
    }
    handleEsc() {
        confirm({
            title: '确定要退出升级?',
            content: '退出升级下次将会从新下载升级包,确定退出?',
            onOk() {
                var win = nw.Window.get();
                win.close();
            },
            onCancel() { },
        });
    }
    versionSelect() {
        this.setState({ upSelect: true });
    }
    render() {
        return (
            <div className="feedback">
                <div>
                    <a onClick={this.versionSelect.bind(this)}> <Icon type="smile" /></a>
                </div>
            </div>
        );
    }
}
Feedback.propTypes = {};
Feedback.defaultProps = {
};