import React, { Component } from 'react';
import { render } from 'react-dom';
import { Popover, Icon } from 'antd';
import FaceList from "../../mod/util/faceList.js";
import "./faceSelect.less"

export default class FaceSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
    shouldComponentUpdate(){
        return false;
    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    clickHandle(item) {
        //console.log(item);
        this.props.handleSelect(item);
    }
    renderFaceList() {
        return FaceList.faceSelectList.map(function (item, index) {
            return (<div className="faceSelectOne" key={"facePanel" + index}><div title={item.text} onClick={this.clickHandle.bind(this, item)} className="imgbg"></div><img src={"img/" + item.file + ".png"} alt={item.text} /></div>);
        }.bind(this));
    }
    render() {
        return (<Popover openClassName="facePopover" placement="topLeft" content={<div className="faceSelectList">{this.renderFaceList()}</div>} trigger="click">
            <a><Icon type="smile-o" /></a>
        </Popover>);
    }
}
FaceSelect.propTypes = {};
FaceSelect.defaultProps = {
    handleSelect: function (values) { },
    visible: false
};