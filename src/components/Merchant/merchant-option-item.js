/**
 * Created by dell on 2016-2-1.
 */
'use strict';

import React from 'react';

import classNames from 'classnames';

require('./merchant-option-item.less');

class OptionItem extends React.Component{

  render(){
    let props=this.props;
    let optItemClass="opt-item";
    if(props.className){
      optItemClass=optItemClass+" "+props.className;
    }
    return(
      <div className={ optItemClass }>
        <a>
          <span className="icon-lineUp"><i className="iconfont icon-line"></i></span>
          <span className="item-word">{ this.props.children }<i className="iconfont icon-next"></i></span>
        </a>
      </div>
    )
  }
}

export default OptionItem;