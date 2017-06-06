'use strict';
import React from 'react';
import { findDOMNode } from 'react-dom';

require('./select-in.less');

class SelectIn extends React.Component{

  constructor(props){
    super(props);

  }


  click(){

    this.props.onClick(this.props.tabKey, this.props.title);

  }
  render(){

    return(
      <li onClick={ this.click.bind(this) } className={ this.props.className }>{ this.props.title }</li>
    )
  }
}
export default SelectIn;