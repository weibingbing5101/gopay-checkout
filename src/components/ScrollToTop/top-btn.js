/**
 * Created by wanghongguang on 16/2/29.
 * 滚动到屏幕的一半，回到顶部按钮显示
 */
'use strict';

import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';

require('./top-btn.less');

class ScrollToTopBtn extends React.Component {


  constructor(props){
    super(props);

    this.state = {
      shown: 'none'
    };

  }

  scrollToTop() {
    function toTop() {
        var timer = null;
        var winscroll = document.documentElement.scrollTop || document.body.scrollTop;
        var speed = winscroll * 30 / 100;
        window.scrollBy(0, -speed);
        if (winscroll > 0) {
            timer = setTimeout(toTop, 30);
        } else {
            clearInterval(timer);
            timer = null;
        }
        document.addEventListener("touchmove", function() {
            clearInterval(timer);
        });
    }
    toTop();
  }

  componentDidMount() {
    let height = $(window).height();
    this.showWhenScrollTo = parseInt( height / 2 );
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

    window.addEventListener('scroll', this.scrollListener, false);
  }

  detachScrollListener () {
    window.removeEventListener('scroll', this.scrollListener);
  }

  handleScroll () {

    let scrollTop = $(window).scrollTop();

    if (scrollTop >= this.showWhenScrollTo) {
      this.setState({shown: ''})
    } else {
      this.setState({shown: 'none'})
    }
  }


  render() {
    let style = {
      display: this.state.shown
    };
    return (
        <a href="javascript:;" onClick={this.scrollToTop} className="backTop" style={style}><i className="iconfont icon-top"></i></a>
    );
  }


}


export default ScrollToTopBtn;