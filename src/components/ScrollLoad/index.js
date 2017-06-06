/**
 * @file 滚动加载组件
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

class ScrollLoad extends React.Component {

  constructor(props){
    super(props);

  }

  componentDidMount() {
    this.scrollParent = findScrollParent(findDOMNode(this));
    this.scrollListener = this.handleScroll.bind(this);
    this.attachScrollListener();
  }

  componentDidUpdate () {
    this.attachScrollListener();
  }

  componentWillUnmount () {
    this.detachScrollListener();
  }
  

  attachScrollListener () {
    if (!this.props.hasMore) {
      return;
    }

    this.scrollParent.addEventListener('scroll', this.scrollListener, false);
    
    // 暂不处理浏览器resize
    //scrollParent.addEventListener('resize', this._handleResize, false);
  }

  detachScrollListener () {
    this.scrollParent.removeEventListener('scroll', this.scrollListener);
  }

  handleScroll () {

    let el = this.scrollParent;
    let scrollTop = $(el).scrollTop();

    if(el.scrollHeight - scrollTop - el.clientHeight <Number(this.props.threshold)){
      this.detachScrollListener();

      this.props.loadMore();
    }
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
        { this.props.children }
      </div>
    );
  }

}

ScrollLoad.defaultProps = {
  hasMore: true,
  threshold: 20
}

export default ScrollLoad;