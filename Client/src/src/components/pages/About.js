import React, { Component } from 'react';
import { render } from 'react-dom';
export default class About extends Component {
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
        this.num = 0;
        console.log("", window.lib.sayHello)
        if (window.lib.sayHello != null) {
            this.timer = setInterval(f => {
                this.num++;
                window.lib.sayHello("第" + this.num + "次调用", function (error, result) {
                    if (error) throw error;
                    console.log(result);
                    this.setState({ text: result });
                }.bind(this));
            }, 1000)
        }
    }
    componentWillReceiveProps(nextProps) {
        //接受到新的数据处理
    }
    componentWillUpdate(nextProps, nextState) {
        //更新前执行
    }
    componentWillUnmount() {
        //准备卸载前执行
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    render() {
        return (<div><h2>{this.state.text}</h2></div>);
    }
}
