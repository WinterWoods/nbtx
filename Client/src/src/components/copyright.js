import React, { Component } from 'react';
import { Button, Popover, Icon, Tooltip, Progress, Badge, message } from 'antd';

import './version.less'

import Util from './mod/util/util.js'
export default class Copyright extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
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
    render() {
        return (
            <div className="copyright">
                <div>
                    <a>内部安全通讯</a> 版权所有 © 2016 时予东 18937885169
                </div>
            </div>
        );
    }
}
Copyright.propTypes = {};
Copyright.defaultProps = {
};