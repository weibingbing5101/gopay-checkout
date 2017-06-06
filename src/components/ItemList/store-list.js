/**
 * Created by wanghongguang on 16/3/10.
 * 用于商品详情页的商户列表，目前需要显示第一个
 */

import React from 'react';

require('./store-list.less');

class StoreList extends React.Component {

  render() {
    let store = this.props.list[0] || {}
    let storeDetail = this.props.storeInfo;
    return (
        <div className="store-box" style={{display:this.props.list.length>0?'':'none'}}>
          <ul className="store-item-list">
            <li className="store-item">
              <span className="store-item-title">商户</span>
              <span className="store-item-text">{this.props.merchantName}</span>
            </li>
            <li className="store-item">
              <span className="store-item-title">提货门店</span>
              <span className="store-item-text">{store.storeName + (storeDetail.plazaName?' - '+storeDetail.plazaName:'')}</span>
            </li>
            <li className="store-item">
              <span className="store-item-title">门店地址</span>
              <span className="store-item-text">{(storeDetail.plazaName?storeDetail.plazaName:'')+
              (store.storeAddress?store.storeAddress:'')+
              (storeDetail.storeFloor? ' ' + storeDetail.storeFloor:'')+
              (storeDetail.storeBunkNo?'-'+storeDetail.storeBunkNo:'')}</span>
            </li>
            <li className="store-item">
              <span className="store-item-title">联系电话</span>
              <span className="store-item-text">{store.storePhone}</span>
            </li>
          </ul>
        </div>
    );
  }
}

export default StoreList;