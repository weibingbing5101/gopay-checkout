'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames/bind';

import SelectItem from './select-item';

require('./select.less');

class Select extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      activeKey: props.defaultActiveKey||this.getDefaultActiveKey(props),
      selectedUp: false
    };
    this.defaultSelectedUp=false
  }

  getDefaultActiveKey(props) {
    return props.children[0].key;
  }

  setActiveKey(key,pullKey,title){
    if(key!=this.state.activeKey){
      this.setState({
        activeKey:key
      })
    }
    if(title){
      this.props.onClick && this.props.onClick(key,pullKey,title)
    }else{//toggle
      this.toggle(key)
    }
  }

  toggle(key){
    this.defaultSelectedUp=true;
   if(this.state.selectedUp){
     this.setState({
       selectedUp:true
     });
    }else{
     this.setState({
       selectedUp:false
     });
    }
  }

  getSelectContents(children){
    let activeKey = this.state.activeKey;
    return children.map( child => {

      var cx = classNames.bind({
        selected:'selected',
        selectedUp:'selected-up'
      });
      var className = cx({selected:activeKey==child.props.selectKey},{selectedUp:activeKey==child.props.selectKey && this.defaultSelectedUp});

      /*let className = '';
      if(activeKey==child.props.selectKey){
        className = 'selected'
      }*/
      return(
        <SelectItem key={ child.props.selectKey } title={ child.props.title } selectKey={ child.props.selectKey } data={ child.props.data } className={ className } onClick={ this.setActiveKey.bind(this) }></SelectItem>
      )
    } )
  }

  render(){

    let selectItems = this.getSelectContents(this.props.children);

    return(
      <div className="select-wrap">
        { selectItems }
      </div>
    )
  }
}

export default Select;