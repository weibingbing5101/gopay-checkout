/**
 * Created by wanghongguang on 16/3/11.
 * 红色警告页面，带哭脸
 */

import React from 'react';
import store from 'store';

import { PropTypes } from 'react-router';

import classNames from 'classnames';
import {Link} from 'react-router';

import $ from 'jquery';

require('./fail-page.less');

class FailPage extends React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    let cls = classNames('fail-page', {'goods-hidden': !this.props.msg});
    return(
        <div className={cls} >
          <div className="cry"></div>
          <div className="fail-text">{this.props.msg}</div>
          <div className="bottom" style={{display:'none'}}><a href="javascript:///;" >{this.props.btnText}</a></div>
        </div>
    );
  }

}

FailPage.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default FailPage;
