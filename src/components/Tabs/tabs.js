/**
 * @file 切换组件
 */

'use strict';

import React from 'react';
import TabTitle from './tab-title';
//const _interopRequireDefault = (obj) => { return obj && obj.__esModule ? obj : { 'default': obj }; }
//const _react2 = _interopRequireDefault(_react);

class Tabs extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      activeKey: props.defaultActiveKey||this.getDefaultActiveKey(props)
    }
  }

  getDefaultActiveKey(props) {
    return props.children[0].key;
  }

  setActiveKey(key) {
    let props = this.props;
    if(props.onTabClick){
      props.onTabClick();
    }
    if(key!==this.state.activeKey){
      this.setState({
        activeKey: key
      })
      if(props.onChange){
        props.onChange(key);
      }
    }
  }

  getTitleContents(children) {
    let activeKey = this.state.activeKey;
    return children.map( child => {
      let className = 'tab-item';
      if(activeKey===child.props.tabKey){
        className += ' tab-active';
      }
      return (
        <TabTitle key={ child.props.tabKey } tabKey={ child.props.tabKey } title={ child.props.title } className={ className } onClick={ this.setActiveKey.bind(this) } />
      )
    })
  }

  render() {
  	let props = this.props;
    let titleContents = this.getTitleContents(props.children);
    return (
    	<ul className='tab-items'>
        { titleContents }
      </ul>
    )
  }

}


export default Tabs;