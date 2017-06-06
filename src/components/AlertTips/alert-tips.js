/**
 * @file button
 */

'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';


require('./alert-tips.less');

class AlertTips extends React.Component {

  constructor(props){
    super(props);
    this.helperAlert = $('<p></p>').css({
      'font-size': 14,
      'display': 'none'
    });
    $(document.body).append(this.helperAlert);
  }

  handleClose(e) {
    e.preventDefault();

    this.props.callbackParent(false);
  }

  calcClassName(text, low){ //low如果是true则显示在底端
    let classNamesObj = {
      'error-alert': true,
      'error-low': low
    };
    this.helperAlert.text(text);
    //console.log(this.helperAlert.width())
    if(this.helperAlert.width()>280){
      classNamesObj['error-alert-mult'] = true;
    }
    return classNames(classNamesObj);
  }

  render() {
    let text = this.props.text;
    let classnames = this.calcClassName(text, this.props.low);
    let style ={
      display: text ? 'block' : 'none'
    };
    return (
      <div className={ classnames } style={ style } onClick={ this.handleClose.bind(this) }>
        <div>
          <span>{ text }</span>
        </div>
      </div>
    )
  }

}

export default AlertTips;