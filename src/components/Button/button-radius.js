import React from 'react';

import BtnCommon from './common';

class BtnRadius extends React.Component{


  render(){

    let btnStyle = this.props.className?'m-button-radius '+this.props.className:'m-button-radius';

    return(
      <div className={ btnStyle }>
        <BtnCommon onClick={ this.props.onClick } to={ this.props.to }>
          { this.props.children || this.props.content }
        </BtnCommon>
      </div>
    )
  }
}

BtnRadius.defaultProps = {
  content: '圆角按钮',
  onClick: () => {},
  to: ''
};

export default BtnRadius;