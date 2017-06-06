'use strict';
import React from 'react';
class TelItem extends React.Component{
  render(){
    const props=this.props;
    let data=props.data

    let icon=data.icon?"iconfont "+data.icon:"";
    let showIconNext=data.iconNext?"iconfont icon-next":"iconfont";//”“±ﬂicon-next
    let to=data.link;

    return(
      <a href={ to }>
        <span className="lf-area"><i className={ icon }></i></span>
        <div className="main-area">
          <span>{ data.content }</span>
        </div>
        <span className="rt-area"><i className={ showIconNext }></i></span>
      </a>
    )
  }
}

export default TelItem;
