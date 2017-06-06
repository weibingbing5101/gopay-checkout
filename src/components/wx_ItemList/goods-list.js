/**
 * Created by dell on 2016-2-2.
 */
import React from 'react';
import Link from 'react-router';

require('./goods-list.less');

/**
 * module:merchant coupon/activity
 *
 * img:
 * content:
 * title:
 */

class GoodsList extends React.Component{

  constructor(props){
    super(props);

  }

  render(){
    let props=this.props;

    let titleStyle={
      display:this.props.title?'block':'none'
    };
    let itemList=props.data.map((item,index)=>{
      return(
        <li key={ index }>
          <a href={ item.url?item.url:'javascript:;' }>
            <div className="coupon-pic">
              <img alt="" src={ item.img }/>
            </div>
            <dl>
              <dt>{ item.title }</dt>
              { item.content }
            </dl>
          </a>
        </li>
      )
    });

    return(
      <div className="m-goods-list">
        <div className="goods-list-tit" style={ titleStyle }>
          { this.props.title }
        </div>
        <div className="goods-list-content">
          <ul>
            { itemList }
          </ul>
        </div>
      </div>
    )
  }
}

export default GoodsList;