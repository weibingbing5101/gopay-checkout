/**
 * @file button
 */

'use strict';

import React from 'react';
import classNames from 'classnames';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2,2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
const prefix = 'btn-';

const isString = (str) => {
  return typeof str === 'string';
};
// 在两个汉字之间插入空格
const insertSpace = (child) => {
  if (isString(child) && isTwoCNChar(child)) {
    return child.split('').join(' ');
  }

  if (isString(child.type) && isTwoCNChar(child.props.children)) {
    return React.cloneElement(child, {},
            child.props.children.split('').join(' '));
  }

  return child;
};

const Button = (props) => {
  //React.addons.classSet({"hidden": true})
  const {type, onClick, children, className, lineType} = props;
  const filterChildren = React.Children.map(children, insertSpace);
  let classNameObj = {
    'button': true
  }
  classNameObj[prefix + type] = true;
  if(lineType){
    classNameObj[prefix +  lineType ] = true;
  }
  if(className){
    classNameObj[className] = true;
  }
  let btnClassName =  classNames(classNameObj);

  return (
    <a className={btnClassName} onClick={onClick}>
      {filterChildren}
    </a>
  );
};

Button.propTypes = {
  type: React.PropTypes.string,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
};

Button.defaultProps = {
  type: 'primary',
  onClick: ()=> {}
};

export default Button;