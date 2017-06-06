/**
 * @file 切换组件的标签
 */

'use strict';

import React from 'react';

class TabTitle extends React.Component {

	onClick(key){
		this.props.onClick(this.props.tabKey);
	}

  render() {
    
    let props = this.props;
    return (
      <li className={ props.className } onClick={  this.onClick.bind(this)  }>
          <span>
          	{ props.title }
          </span>
      </li>
    )
  }

}

export default TabTitle;