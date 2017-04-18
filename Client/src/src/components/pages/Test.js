import React, { Component } from 'react';


export default class Test extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: '1'
        }
    }

    render() {
        return (<div><h2>测试2</h2></div>);
    }
}
