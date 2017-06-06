import React from 'react';

class InfoBd extends React.Component{
  render(){
    let className = this.props.className ? 'm-info-box-bd '+this.props.className : 'm-info-box-bd';
    return(
      <div className={ className }>
        { this.props.children }
      </div>
    )
  }
}

export default InfoBd