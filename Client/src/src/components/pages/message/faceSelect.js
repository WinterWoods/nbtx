import React, { Component } from 'react';
import { render } from 'react-dom';
import { Popover, Icon } from 'antd';

import "./faceSelect.less"

export default class FaceSelect extends Component {
    constructor(props) {
        super(props);
        this.faceSelectList = ["微笑", "憨笑", "色", "发呆", "老板", "流泪", "害羞", "闭嘴",
            "睡", "大哭", "尴尬", "发怒", "调皮", "大笑", "惊讶", "流汗",
            "广播", "阴笑", "你强", "怒吼", "惊愕", "疑问", "OK", "鼓掌",
            "握手", "偷笑", "无聊", "加油", "快哭了", "吐", "晕", "摸摸",
            "胜利", "飞吻", "跳舞", "傻笑", "鄙视", "嘘", "衰", "思考",
            "亲亲", "无奈", "感冒", "发烧", "对不起", "再见", "投降", "哼", "欠扁",
            "恭喜", "可怜", "舒服", "爱意", "单挑", "财迷", "迷惑", "委屈",
            "灵感", "天使", "鬼脸", "凄凉", "郁闷", "邪恶", "忍者", "色情狂",
            "算账", "炸弹", "邮件", "电话", "礼物", "爱心", "心碎", "嘴唇",
            "鲜花", "残花", "出差", "干杯"];
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
    componentWillUnmount() {
        //准备卸载前执行
    }
    clickHandle(item) {
        //console.log(item);
        this.props.handleSelect(item);
    }
    renderFaceList() {

        return this.faceSelectList.map(function (item, index) {
            return (<div className="faceSelectOne" key={"facePanel" + index}><div title={item} onClick={this.clickHandle.bind(this, item)} className="imgbg"></div><img src={"img/" + item + ".png"} alt={item} /></div>);

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