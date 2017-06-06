import React from 'react';

class InfoCont extends React.Component{
  render(){
    return(
      <div className="m-info-box-cont">
        { this.props.children }
      </div>
    )
  }
}
export default InfoCont;