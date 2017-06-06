import React from 'react';

import ImgLazy from '../ImgLazy';

class InfoImg extends React.Component{
  render(){
    return(
      <div className="m-info-box-img">
        <ImgLazy src={ this.props.src } defaultSrc={ this.props.imgDefault }/>
      </div>
    )
  }
}
export default InfoImg;