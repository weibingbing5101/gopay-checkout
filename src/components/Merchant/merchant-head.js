/**
 * Created by dell on 2016-1-29.
 */
import React from 'react';

require('./merchant-head.less');
import MerchantTitle from './merchant-title';

class MerchantHead extends React.Component{
  handleClick(){
    this.props.onClick?this.props.onClick():""
  }
  render(){
    let props=this.props;
    let merchantTitle={
      img:props.merchantImg,
      title:props.merchantTitle
    };
    let showMore=this.props.onClick?true:false;
    let merchantStyle=this.props.className?'merchant-header '+this.props.className:'merchant-header';
    return(
      <div className={ merchantStyle } onClick={ this.handleClick.bind(this) }>
        <a href="javascript:;">
          <MerchantTitle data={ merchantTitle } showMore={ showMore }></MerchantTitle>
        </a>
      </div>
    )
  }
}
export default MerchantHead