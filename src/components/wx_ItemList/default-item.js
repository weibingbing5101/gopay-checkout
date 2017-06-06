'use strict';
import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

/**
 * TODO:�Ż�
 */
//<span className="rt-area"><i className={ showIconNext }></i></span>

class DefaultItem extends React.Component{

  render(){

    let data = this.props.data;
    let icon=data.icon?"iconfont "+data.icon:"";
    let showIconNext=data.iconNext?"iconfont icon-next":"iconfont";
    let showSideCont=data.sideContent?"main-area main-side-cont":"main-area";

    let mainContStyle = classNames({
      'item-no-rt-icon':!data.iconNext,
      'item-no-lf-icon':!data.icon
    });
    let content = (
      <div className={ mainContStyle }>
        <span className="lf-area"><i className={ icon }></i></span>
        <div className={ showSideCont }>
          <span>{ data.content }</span>
          <span className="side-content">{ data.sideContent }</span>
        </div>
      </div>
    );

    let defautltItem = data.link ? (
      <Link to={ data.link }>
        { content }
      </Link>
    ) : (
      <a onClick={ data.clickAction }>
        { content }
      </a>
    );

    return (
      <div>
        { defautltItem }
      </div>
    )
  }
}

//Ĭ������
DefaultItem.defaultProps = {
  data: {
    clickAction: () => {},
    link: '',
    iconNext: true
  }
};

export default DefaultItem;
