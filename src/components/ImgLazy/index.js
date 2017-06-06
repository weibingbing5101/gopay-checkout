/**
 * @file 图片延时加载组件
*/
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

const defaultImg = require('./img/default.png');

class ImgLazy extends Component {
  constructor(props) {
    super(props);

    this.state = {
    	src: this.props.defaultSrc || defaultImg
    }


    var img = new Image();
    img.onload = function(){
    	this.setState({
    		src: img.src
    	})
    }.bind(this);
    img.src = this.props.src;
  }

  render() {
    return (
      <img src={ this.state.src } className={ this.props.className } />
    );
  }
}

export default ImgLazy;