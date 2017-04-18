import React, { Component } from 'react';
import { Modal, Button} from 'antd';


export default class HeadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgResult: null
        }
    }
    render() {
        return (<img className={this.props.className} src={window.headPic(this.props.userKey,this.props.type)} />);
    }
}
HeadImg.propTypes = {};
HeadImg.defaultProps = {
    className: "",
    userKey: "",
    type: "1"
};