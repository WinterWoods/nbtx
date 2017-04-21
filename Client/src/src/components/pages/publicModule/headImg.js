import React, { Component } from 'react';
import { Modal, Button} from 'antd';

import "./headImg.less";

export default class HeadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgResult: null
        }
    }
    render() {
        return (<img className={"headimg"} src={window.headPic(this.props.userKey,this.props.type)} />);
    }
}
HeadImg.propTypes = {};
HeadImg.defaultProps = {
    className: "",
    userKey: "",
    type: "1"
};