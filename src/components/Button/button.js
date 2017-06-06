'use strict';

import React from 'react';
import classNames from 'classnames';

import BtnCommon from './common';

const Button = ( props ) => {

  //TODO:classname需要重构
  var btnStateStyle = props.btnState ? 'm-btn m-btn-active':'m-btn';
  if(props.className){
    btnStateStyle = btnStateStyle + ' ' + props.className
  }


  let clickHandle = () => {
    // if(props.btnState){
      props.onClick && props.onClick()
    // }
  };

  return (
    <div className={ btnStateStyle }>
      <BtnCommon onClick={ clickHandle }>
        <span className="m-btn-text">
            {props.title || props.children}
        </span>
      </BtnCommon>
    </div>
  );
};

Button.defaultProps = {

};

export default Button;
