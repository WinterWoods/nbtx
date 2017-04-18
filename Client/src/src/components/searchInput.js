import React, { Component } from 'react';
import { Input, Button, Popover } from 'antd';
import classNames from 'classnames';
const InputGroup = Input.Group;
import './searchInput.less'
import HeadImg from './pages/publicModule/headImg.js';
export default class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      focus: false,
      visible: false,
      list: [],
      selectIndex: 0
    };
  }
  handleInputChange(e) {
    this.setState({
      value: e.target.value

    });
  }
  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  }
  handleVisibleChange(visible) {
    this.setState({ visible });
  }
  handleSearch(e) {
    if (event.keyCode == 38 || event.keyCode == 40) {
      return
    }
    var self = this;
    if (this.props.onSearch) {
      this.setState({
        visible: true
      });
      //如果有值 才进行搜索，没有值不进行查询
      if (this.state.value) {
        window.orgManager.search({ value: this.state.value })
          .done(function (result) {
            console.log(result);
            self.setState({ list: result });
          })
      }

      //this.props.onSearch(this.state.value);
    }
  }
  openSendMessage() {

    this.setState({ visible: false, value: "" });
    document.getElementById("searchInput").blur();
    if (this.state.list[this.state.selectIndex])
      this.props.onSearch(this.state.list[this.state.selectIndex]);
  }
  openSendMessage1(item, index) {
    console.log(item, index)
    this.setState({ visible: false, value: "" });
    document.getElementById("searchInput").blur();
    console.log(item);
    this.props.onSearch(item);
  }
  onKeyDown() {
    var self = this;
    if (event.keyCode == 38) {
      event.returnValue = false;
      self.state.selectIndex--;
      if (self.state.selectIndex < 0) self.state.selectIndex = 0;
      self.setState({ selectIndex: self.state.selectIndex });
    }
    else if (event.keyCode == 40) {
      event.returnValue = false;
      self.state.selectIndex++;
      if (self.state.selectIndex > (self.state.list.length - 1)) self.state.selectIndex = (self.state.list.length - 1);
      self.setState({ selectIndex: self.state.selectIndex });
    }

  }
  renderList() {
    if (this.state.value.length == 0) {
      return <div className="null"><span>请输入搜索内容</span></div>;
    }
    else if (this.state.list.length == 0) {
      return <div className="null"><span>抱歉没有查询到</span></div>;
    }
    else {
      return this.state.list.map(function (item, index) {
        return (
          <div onClick={this.openSendMessage1.bind(this, item, index)} key={item.Key + "searchDiv"} className={"searchList " + (index == this.state.selectIndex ? "searchListSelect" : "")}>
            <div className="imgDiv">
              <HeadImg className="img" userKey={item.Key} />
            </div>
            <div className="info">
              <div className="name">
                {item.Name}
              </div>
              <div className="unit">
                {item.Info}
              </div>
            </div>

          </div>
        );
      }.bind(this))
    }

  }
  render() {
    const { style, size, restProps } = this.props;
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });
    return (
      <Popover overlayClassName="searchPanel" content={this.renderList()} title="" trigger="click"
        visible={this.state.visible} onVisibleChange={this.handleVisibleChange.bind(this)}
        >
        <div className="seachDataListPanel" style={style}>
          <InputGroup className={searchCls}>
            <Input {...restProps} id="searchInput" placeholder="搜索联系人" onKeyDown={this.onKeyDown.bind(this)} value={this.state.value} onChange={this.handleInputChange.bind(this)}
              onFocus={this.handleFocusBlur.bind(this)} onBlur={this.handleFocusBlur.bind(this)} onKeyUp={this.handleSearch.bind(this)} onPressEnter={this.openSendMessage.bind(this)}
              />
            <div className="ant-input-group-wrap">
              <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch.bind(this)} />
            </div>
          </InputGroup>
        </div>
      </Popover>
    );
  }
}