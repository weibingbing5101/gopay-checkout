/**
 * Created by wanghongguang on 16/3/4.
 */
import React from 'react';
import store from 'store';

import { PropTypes } from 'react-router';

import { globalConfig,orderConfig } from '../../modules/config';
import tracking from '../../modules/tracking';

import CommonAction from '../../actions/common-action';
import GoodsAction from '../../actions/goods-action';
import GoodsStore from '../../stores/goods-store';

import { goodsInterface } from '../../modules/data-interface';

import $ from 'jquery';
import _ from 'underscore';

require('./order.less');

class Good{
    constructor() {
        this.pic = '';
        this.name = '';
        this.price = 0;
        this.buyNumber = 0;
        this.store = '';
        this.storeObj = {};
    }
}

class GoodsOrder extends React.Component {


  constructor(props) {
    super(props);
    this.cityId=store.get('cityId');
    this.plazaId=store.get('plazaId');
    this.params = this.props.params;
    this.user = store.get("ffan_user");
    this.detail = null;
    this.promotion = null;
    this.mobile = this.user && this.user.member && this.user.member.mobile ? this.user.member.mobile : '';
    if (this.params.adId) {
      this.params.flashsale=1;
    }
    this.params.display_type='json';

    this.state={
      good:new Good(),
      ordering: false
    }
  }

  componentDidMount(){
    this.unsubscribe = GoodsStore.listen(this.onStoreChanged.bind(this));
    GoodsAction.getGoodsDetail(this.params);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStoreChanged(res){

    let good = new Good();
    let data = res.data;
    if(data && data.goods_detail && data.goods_detail.goods){
        let g = data.goods_detail.goods;
        good.name = g.name;
        let {price,buyNumber} = this.props.params;
        good.price = price;
        good.buyNumber = buyNumber;
        if(data.goods_detail.goodsPics && data.goods_detail.goodsPics.length > 0){
            good.pic = data.goods_detail.goodsPics[0].pic;
        }
        if(data.goods_detail.goodsScopes && data.goods_detail.goodsScopes.length>0){
            good.store = data.goods_detail.goodsScopes[0].storeViewName;
            good.storeObj = data.goods_detail.goodsScopes[0];
        }
        this.detail = data.goods_detail;
        this.promotion = g.promotion && g.promotion.length > 0? g.promotion[0] : null;
        this.setState({
            good
        });
    }
  }

  handleMobileChange(e){

  }




  createOrder(e) {
    if(this.state.ordering) return;
    let that = this;
    var orderType = function () {
       if (that.promotion) {
         switch (that.promotion.promotionType) {
           case 0:
             return "goods_0";//闪购
           case 1:
             return "goods_1";//1元
         }
       } else {
         return "";//普通商品
       }
    }();

    let goods = this.state.good;
    let tradeCode = 7013;
    let productInfos = [];
    productInfos.push({
       productId: that.params.productId,
       count: goods.buyNumber,
       productInfo: {
         price: goods.price,
         title: goods.name
       },
       "productCode": tradeCode
    });
    let remark = {};
    let storeId = goods.storeObj.outlet;
    if (that.params.adId) {
      remark = {
        'flashSale': 1,
        "adId": that.params.adId,
        "orderType": orderType
      };
    } else {
      remark = {'flashSale': 0, "orderType": ""};
    }
    that.setState({ordering: true});
    CommonAction.loading(true, '正在生成订单');
    goodsInterface.createGoodsOrder(
        { tradeCode: tradeCode,
          productInfos: productInfos,
          remark: remark,
          storeId: storeId,
          buyNumber: goods.buyNumber,
          price:goods.price,
          phoneNo: that.mobile
    }).then(function(ret) {
          //setTimeout(function(){
          //  that.setState({ordering: false});
          //}, 1500);
          that.setState({ordering: false});
          CommonAction.loading(false);
          var orderType=remark.orderType?remark.orderType:"";
          if (ret.status == 200) {
            //if(orderType){
            //  TrackingService.tracking("M_ORDER_SUCC",{
            //    "user_id":utils.getUser().uid,
            //    "order_id":ret.orderNo,
            //    "order_type":orderType
            //  });
            //}

            if(ret.realPay == 0){
              //if(orderType){
              //  TrackingService.tracking("M_ORDER_PAY_SUCC",{
              //    "user_id":utils.getUser().uid,
              //    "buy_amount":buyNumber,
              //    "order_id":ret.orderNo,
              //    "order_type":orderType
              //  });
              //}

              this.context.history.pushState(null, '/pay/success');
            }else{
              if (typeof WeixinJSBridge == "undefined"){
                this.context.history.pushState(null, '/pay/order/'+ret.orderNo);
              }else{
                //获取微信授权。然后返回到支付页面
                location.href = orderConfig.WeChat.wxRedirect+"state="+ret.orderNo+"#wechat_redirect";
              }
              
            }
          } else {
            var message = ret.message||'未知错误';
            CommonAction.alert(message);
            if (ret && ret.message && ret.message.indexOf('重新登录') > -1) {
              this.context.history.pushState(null,"/me/login", {
                redirectUrl:that.props.location.pathname
              });
            } else {
              console.log('未知错误', ret);
            }
          }
    }.bind(this)).fail(function(msg) {
          that.setState({ordering: false});
          CommonAction.loading(false);
          CommonAction.alert(msg);
    });
  }

  filterPrice(price){
    price = String(parseFloat(price));
    if(price.indexOf('.')<0){
      return ~~price;
    }
    if(price.length - price.indexOf('.')===2){
      return parseFloat(price).toFixed(1);
    }else{
      return parseFloat(price).toFixed(2);
    }
  }

  render() {
    let {name,pic,store,buyNumber,price} = this.state.good;
  	return (
  	 <article className="g-wrapper-order-create">
    <header className="header" style={{display:'none'}}>
    </header>
    <section className="g-main">
        <form>
            <div className="mainIn">
                <h2 className="mainTitBar">商品清单</h2>
                <div className="listBox">
                    <div className="m-main listBar">
                        <div className="m-left"><img src={pic} /></div>
                        <div className="m-center">
                            <p>{name}</p>
                        </div>
                        <div className="m-right">
                            <p className="price">￥{this.filterPrice(price)}</p>
                            <p className="count">X{buyNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="g-gap"></div>
                <div className="commodityInfo">
                  <div className="m-main commodityBar">
                    <div className="m-left">配送方式</div>
                    <div className="m-right">自提</div>
                  </div>
                    <div className="m-main commodityBar">
                        <div className="m-left">提货门店</div>
                        <div className="m-right"><span className="address">{store}</span></div>
                    </div>
                </div>
                <div className="g-gap"></div>
                <div className="phoneBox">
                    <h3>将发送取票码和提货码至以下手机号</h3>
                    <input type="tel" readOnly="true" value={this.mobile} onChange={ function(e){ this.handleMobileChange(e); }.bind(this) }/>
                </div>
                <div className="g-gap"></div>
                <div className="m-main totalInfo">
                    <div className="m-left">总金额</div>
                    <div className="m-right">￥{this.filterPrice(price*buyNumber)}</div>
                </div>
                <div className="m-main submitInfo">
                    <div className="m-left">应付金额 ￥{this.filterPrice(price * buyNumber)}</div>
                    <div className="m-right">
                        <input type="button" value="提交订单" className="submitBut" onClick={ function(e){ this.createOrder(e); }.bind(this)}/>
                    </div>
                </div>
            </div>
        </form>
    </section>

</article>

  	);
  }

}

GoodsOrder.defaultProps = { title: '确认订单' };

GoodsOrder.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default GoodsOrder;
