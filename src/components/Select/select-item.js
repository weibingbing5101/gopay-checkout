'use strict';
import React from 'react';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';

import SelectIn from './select-in';

class SelectItem extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      activeKey:0
    }
  }

  toggle(){
    var dom = findDOMNode(this);
    this.props.onClick(this.props.selectKey,0,'');
    let display=$(findDOMNode(this)).find("ul").css("display");
    if(display==="block"){
      $(dom).find("ul").css("display","none")
      $(dom).find("a").removeClass("selected-up");
    }else{
      let aUl=$(dom).parent().find("ul");
      let aA=$(dom).parent().find("a");
      for(let i=0;i<aUl.length;i++){
        $(aUl[i]).css("display","none");
        $(aA[i]).removeClass("selected-up")
      }
      $(dom).find("ul").css("display","block");
      $(dom).find("a").addClass("selected-up");
    }
  }

  change(key, title){
    var dom = findDOMNode(this)
    this.setActiveKey(key);
    this.props.onClick(this.props.selectKey, key, title);
    $(dom).find("ul").css("display","none");
    $(dom).find("a").removeClass("selected-up");
  }

  setActiveKey(key){
    if(key!==this.state.activeKey){
      this.setState({
        activeKey: key
      })
    }
  }

  render(){
    let title=this.props.title;
    let data=this.props.data;

    let item;
    if(data){
      let activeKey = this.state.activeKey;
      item = data.map( (item,index)=>{
        let className="";
        if(activeKey===index){
          className="selected-item"
        }
        return(
          <SelectIn key={ index } tabKey={ index } onClick={ this.change.bind(this) } title={ item } className={ className }></SelectIn>
        )
      })
    }

    return(
      <div className="select-area">
        <a className={ this.props.className } href="javascript:;" onClick = { this.toggle.bind(this) } ><span>{ title }</span><i className="iconfont"></i></a>
        <ul >
          { item }
        </ul>
      </div>
    )
  }

}
export default SelectItem;