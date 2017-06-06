/**
 * @file 滚动加载和批量替换渲染组件
*/

'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';

const findScrollParent = (el) => {
  var ref = el;
  while (ref) {
    switch (window.getComputedStyle(ref).overflow) {
      case 'auto':
        return ref;
      case 'scroll':
        return ref;
    }
    ref = ref.parentElement;
  }
  return window;
};

function logPrint(arg){
  var str = (arg.title||'')+'\n';
  if(arg.data){
    let data = arg.data;
    str += Object.keys(data).map(function(key){
      return key + '：' + data[key];
    }).join('\n');
  }
}

class InfiniteScroll extends React.Component {

  constructor(props){
    super(props);

    this.allItems = [];
    this.startNum = 0;
    this.topSpacerHeight = 0;
    this.bottomSpacerHeight = 0;
    this.hasMore = true;
    //this.originTopSpaceHeight = 0;
    this.itemHeight = props.itemHeight;

    this.state = {
      showItems: []
    }
  }


  componentWillReceiveProps(nextProps){
    // 以后会支持初始时传入topSpaceHeight
    /*if(nextProps.topSpaceHeight&&nextProps.topSpaceHeight!==this.originTopSpaceHeight){
      this.originTopSpaceHeight = nextProps.topSpaceHeight;
      if(this.scrollParent){
        this.scrollParent.scrollTop = 0;
      }
    }*/
    this.allItems = nextProps.children;
    this.hasMore = nextProps.hasMore;
    this.calcShowItems();
    this.isLoading = false;
  }

  componentDidMount() {
    if(!this.allShowItemsNum){
      this.clientHeight = findDOMNode(this).offsetHeight;
      this.clientShowItemsNum =  Math.ceil(this.clientHeight/this.itemHeight);
      this.allShowItemsNum = this.clientShowItemsNum*6;
      // 重新渲染的计算公式为：总的显示个数/屏数（固定为3屏）* 2（最后一屏出现的位置）
      this.rerenderItemsNum = (this.allShowItemsNum/3*2);
    }
    this.scrollParent = findScrollParent(findDOMNode(this));
    this.scrollListener = this.handleScroll.bind(this);
    this.scrollName = this.scrollParent.ontouchmove ? 'touchmove' : 'scroll';
    this.attachScrollListener();

    this.allItems = this.props.children;
    this.hasMore = this.props.hasMore;
    this.calcShowItems();
    this.isLoading = false;
  }

  componentDidUpdate () {
    //this.attachScrollListener();
  }

  componentWillUnmount () {
    this.detachScrollListener();
  }


  attachScrollListener () {
    if (!this.hasMore) {
      return;
    }

    this.scrollParent.addEventListener(this.scrollName, this.scrollListener, false);

    // 暂不处理浏览器resize
    //scrollParent.addEventListener("resize", this._handleResize, false);
  }

  detachScrollListener () {
    this.scrollParent.removeEventListener(this.scrollName, this.scrollListener);
  }

  handleScroll () {

    if(this.isLoading){
      return;
    }

    let el = this.scrollParent;
    let scrollTop = $(el).scrollTop();
    let itemHeight = this.itemHeight;
    let shouldTopNum = Math.floor(scrollTop/itemHeight);
    let showItemsNum = this.clientShowItemsNum;
    let rerenderItemsNum = this.rerenderItemsNum;

    // 向下滑动超过了限制
    if(shouldTopNum - this.startNum >= rerenderItemsNum){
      this.calcShowItems();
    // 向上滑动超过了限制
    }else if(this.startNum>showItemsNum&&(shouldTopNum - this.startNum < 0) ){
      this.calcShowItems();
    }else if(this.startNum<=showItemsNum&&this.topSpacerHeight){
      this.calcShowItems();
    }

   /* if(el.scrollHeight - scrollTop - el.clientHeight <Number(this.props.threshold)){
      this.detachScrollListener();

      this.props.loadMore();
    }*/
  }

  calcShowItems(){
    let scrollTop = $(this.scrollParent).scrollTop();
    let itemHeight = this.itemHeight;
    let shouldTopNum = Math.floor(scrollTop/itemHeight);
    let showItemsNum = this.clientShowItemsNum;

    let allItemsLength = this.allItems.length;
    let endNum;
    let startNum;

    startNum = shouldTopNum < showItemsNum ? 0 : shouldTopNum - Math.floor(this.rerenderItemsNum/2);
    if(startNum<0){
      startNum=0;
    }
    endNum = startNum + this.allShowItemsNum;

    if(endNum>=allItemsLength){
      if(this.hasMore){
        this.isLoading = true;
        this.props.loadMore();
        return;
      }else{
        endNum = allItemsLength;
      }
    }

    /*logPrint({
      title: 'InfiniteScroll items replace',
      data: {
        startNum: startNum,
        endNum: endNum
      }
    })*/

    this.startNum = startNum;
    this.endNum = endNum;
    this.topSpacerHeight = this.startNum*itemHeight;
    this.bottomSpacerHeight = (allItemsLength - endNum)*itemHeight;
    this.setState({
      showItems: this.allItems.slice(startNum, endNum)
    })

  }

  buildHeightStyle(height) {
    return {
      width: '100%',
      height: Math.ceil(height)
    }
  }

  render() {
    return (
      <div className={ this.props.className }>
        <div className="topSpacer"
             style={this.buildHeightStyle(this.topSpacerHeight)}></div>
        { this.state.showItems }
        <div className="bottomSpacer"
             style={this.buildHeightStyle(this.bottomSpacerHeight)}></div>
      </div>
    );
  }

}

InfiniteScroll.defaultProps = {
}

export default InfiniteScroll;