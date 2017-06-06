import React from 'react';

class InfoHd extends React.Component{
  render(){
    return(
      <div className="m-info-box-hd">
        { this.props.children }
      </div>
    )
  }
}

export default InfoHd