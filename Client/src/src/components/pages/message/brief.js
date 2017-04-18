import React, { Component } from 'react';
import { render } from 'react-dom';
import { Icon, Button, Tooltip, Input } from 'antd';

import "./brief.less"

import Util from '../../mod/util/util.js'
export default class Brief extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editFlag: false,
            brief: ""
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

        if (nextProps.visiblePanel == false) {
            this.setState({ editFlag: false });
        }
    }
    reloadFileList(info) {
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentDidUpdate(prevProps, prevState) {

    }
    componentWillUnmount() {
        //准备卸载前执行
    }
    onClickEdit() {
        this.setState({ editFlag: true, brief: this.props.groupInfo.GroupBrief });
    }
    onClickEditEsc() {
        this.setState({ editFlag: false });
    }
    onClickEditSave() {
        var self = this;
        window.orgManager.upBrief({ Brief: self.state.brief, GroupKey: self.props.groupInfo.Key })
            .done(function () {
                self.setState({ editFlag: false });
                self.props.reloadGroupInfo(self.props.groupInfo.Key, self.state.groupName);
            });

    }
    textareaChange(e) {
        this.setState({ brief: e.target.value });
    }
    render() {
        return (<div className="briefPanel" >
            <div className="context">
                {
                    this.state.editFlag ? <div className="topContext">
                        <textarea className="textareaInput" onChange={this.textareaChange.bind(this)}>
                            {this.state.brief}
                        </textarea>
                    </div> :
                        this.props.groupInfo.GroupBrief ?
                            < div className="topContext">
                                <div className="userInfo">
                                    <div className="name">{this.props.groupNameGet(this.props.groupInfo.BriefUpKey)}</div>
                                    <div className="time">{this.props.groupInfo.BriefUpTime ? Util.getLastTime(this.props.groupInfo.BriefUpTime) : ""}</div>
                                </div>
                                <div className="text">
                                    {this.props.groupInfo.GroupBrief}</div>
                            </div>
                            :
                            <div className="topContext">
                                该群暂时没有公告
                        </div>

                }
            </div>
            {this.props.groupInfo.OnlyMainManager && this.props.groupInfo.GroupMainKey != window.LoginUser.Key ? "" : this.state.editFlag ?
                <div className="btns btnsEdit">
                    <Button onClick={this.onClickEditEsc.bind(this)}>取消</Button>
                    <Button type="primary" onClick={this.onClickEditSave.bind(this)}>保存</Button>
                </div> :
                <div className="btns">
                    <Button type="primary" onClick={this.onClickEdit.bind(this)}>编辑公告</Button>
                </div>
            }
        </div >);
    }
}
Brief.propTypes = {};
Brief.defaultProps = {
    groupInfo: {},
    visiblePanel: false,
    groupNameGet: function (key) { },
    reloadGroupInfo: function (key) { }
};