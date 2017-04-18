import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon } from 'antd';
import "./modalPanel.less"
export default class ModalPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '1',
            text: ""
        }
    }
    componentWillMount() {
        //渲染前执行

    }
    componentDidMount() {
        //渲染完成后执行
    }
    componentWillReceiveProps(nextProps) {
        // if (nextProps.visible != this.props.visible) {
        //     //接受到新的数据处理
        //     if (nextProps.visible) {
        //         document.onclick = function (e) {
        //             nextProps.closePanel();
        //         }.bind(this)
        //     }
        //     else {
        //         document.onclick = null;
        //     }
        // }

    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentDidUpdate(nextProps, nextState) {

    }
    componentWillUnmount() {
        //准备卸载前执行
        //document.onclick = null;
    }
    handleClick(e) {
        e.nativeEvent.stopImmediatePropagation();
        this.props.closePanel();
    }
    stopClose(e) {
        e.nativeEvent.stopImmediatePropagation();

    }
    close() {
        this.props.closePanel();
    }
    render() {
        return (<div className="modalPanel" onClick={this.stopClose.bind(this)} style={{ display: this.props.visible ? "flex" : "none" }}>
            <div className="closePanel" onClick={this.close.bind(this)}></div>
            <div className="panel">
                <div className="top">
                    {this.props.title}
                    <div className="CloseBtn" onClick={this.handleClick.bind(this)}><Icon type="close" /></div>
                </div>
                <div className="bottom">
                    {this.props.children}
                </div>
            </div>
        </div>);
    }
}
ModalPanel.propTypes = {};
ModalPanel.defaultProps = {
    visible: false,
    closePanel: function () { },
    title: ""
};