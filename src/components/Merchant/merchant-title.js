/**
 * Created by dell on 2016-1-29.
 */
import React from 'react';

require('./merchant-title.less');

class MerchantTitle extends React.Component{
  render(){
    let props=this.props;
    //TODO:是否有默认图片
    let img=props.data.img?"http://img1.ffan.com/norm_120/"+props.data.img:"";
    let showMore={
      display:props.showMore?'inline-block':'none'
    }
    return(
      <div className="merchant">
        <img alt="" src={ img } />
        <div className="merchant-tit">
          <span>{ props.data.title }</span><i className="iconfont icon-next" style={ showMore }></i>
        </div>
      </div>
    )
  }
}

MerchantTitle.defaultProps={
  imgSrc:""
};

export default MerchantTitle;
