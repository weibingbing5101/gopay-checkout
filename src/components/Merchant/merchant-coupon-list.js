/**
 * Created by dell on 2016-2-2.
 */
import React from 'react';
import Link from 'react-router';

require('./merchant-coupon-list.less');

/**
 * module:merchant coupon/activity
 *
 * img:
 * content:
 * title:
 */

class CouponList extends React.Component{

  constructor(props){
    super(props);

  }

  render(){
    let props=this.props;

    let itemList=props.data.map((item,index)=>{
      return(
        <li key={ index }>
          <a href={ item.url }>
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
      <div>
        <div className="coupon-tit">
          <h2><strong>{ this.props.title }</strong></h2>
        </div>
        <div className="coupon-content">
          <ul>
            { itemList }
          </ul>
        </div>
      </div>
    )
  }
}

export default CouponList;