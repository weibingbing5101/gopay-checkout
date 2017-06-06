/**
 * @file 商户名称和图标
 */

'use strict';
import React from 'react';
import classNames from 'classnames';
import { LocationSearchToJson,setStrLength,makeSpaceValid } from '../../modules/tools';

class MerSnap extends React.Component {
    /**
     * @desc 构造函数
     * @param props
     */
    constructor(props) {
      super(props);

      
      let searchObj = LocationSearchToJson();
      let stateObj = {};
      if(searchObj){
        stateObj = {
          icon: searchObj.appIconUrl,
          name: this._makeSpaceValid(setStrLength(searchObj.appName,20))
        }    
      }


      this.state = stateObj;
    }

    componentDidMount() {
      
    }

    _makeSpaceValid(str){
      return str.split(' ').map(function(item,index){
          return item === '' ? <span key={index}>&nbsp;</span> : <span key={index}>{item}</span>;
      });
  }

    render(){
        return this.state.name ? (
          <div className="mer-snap">
                <span className="mer-snap-icon">
                  <img src={this.state.icon} />
                </span>
                <span className="mer-snap-name">{this.state.name}</span>
            </div>
        ) : false;
    };
}

export default MerSnap;