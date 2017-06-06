import React from 'react';

import { Link } from 'react-router';

/**
 * 主要封装了一下btn的点击功能
 */
class Common extends React.Component{

  clickHandle(){
    this.props.onClick();
  }

  render(){

    let btnCommon = this.props.to ? (
      <Link to={ this.props.to } className="m-btn-common">
        { this.props.children }
      </Link>
    ):(
      <a onClick={ this.clickHandle.bind(this) } className="m-btn-common">
        { this.props.children }
      </a>
    );

    return(
      <div>
        { btnCommon }
      </div>
    )
  }
}

Common.defaultProps = {
  onClick: () => {},
  to: ''
};

export default Common;