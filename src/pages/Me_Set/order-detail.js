import React from 'react';

import { Link } from 'react-router';

require('./order-detail.less');

import dateformat from 'dateformat';

import { orderConfig } from '../../modules/config';

import CommonAction from '../../actions/common-action';
import OrderAction from '../../actions/order-action';
import OrderStore from '../../stores/order-store';
import DetailAction from '../../actions/detail-action';
import DetailStore from '../../stores/detail-store'

import { InfoBox, InfoHd, InfoBd, InfoCont, InfoImg } from '../../components/InfoBox'
import { Button } from '../../components/Button';

const ORDER_TYPE = orderConfig.ORDER_TYPE;
const ORDER_STATUS = orderConfig.ORDER_STATUS;
const ORDER_CODE = {
  TICKET_TRADE: 7009,
  COUPON_TRADE: 7010,
  ENTITY_TRADE: 7013,
  CATERING_TRADE: 7014,
  HANXIU_TRADE: 7012,
  LEYUAN_TRADE: 7015,
  FLASHPAY_TRADE: 7030
};
const IMG_HOST = 'http://img1.ffan.com/norm_680/';
const imgSrc = require('./img/lefuIcon.jpg');

class OrderDetail extends React.Component {

  constructor(props) {
    super(props);
    this.orderId = this.props.params.orderId;
    this.state = {
      orderDetail: {},
      code: ''
    };
    this.orderDetail = {};
    this.orderCode = 0;
    this.storeDetail = {};
  }

  componentDidMount() {
    this.unsubscribe = OrderStore.listen(this.onStoreChanged.bind(this));
    this.unsubscribeStore = DetailStore.listen(this.onGetScore.bind(this));
    OrderAction.getOrderDetail({
      'orderId': this.orderId
    })
  }

  componentWillUnmount() {

    this.unsubscribeCode && this.unsubscribeCode();
    this.unsubscribeStore();
  }


  onStoreChanged({ loading, error, data }) {
    if (loading != undefined) {
      CommonAction.loading(loading)
    }
    if (error) {
      //CommonAction.alert(error)
    }
    if (data) {
      this.orderDetail = data;
      this.orderCode = data.orderCode;
      this.getCode();
      this.setState({
        orderDetail: data,
        orderCode: data.orderCode
      });


      if (data.storeId) {
        DetailAction.getMerchantDetail({
          storeid:data.storeId,
          display_type:'json'
        });
      }

      this.unsubscribe();
    }
  }

  onGetScore(info){
    if(info.data && info.data.detail){
      this.storeDetail = info.data.detail;
      this.setState({});
    }
  }

  onCodeStoreChanged({ loading, error, data }) {
    if (data) {
      var code = '';
      switch (this.orderCode) {
        case ORDER_CODE.COUPON_TRADE://券订单
        case ORDER_CODE.CATERING_TRADE://餐饮订单
          code = data.coupons[0].couponNo;
          break;
        case ORDER_CODE.ENTITY_TRADE://实物订单
          code = data.data.sign;
          break;
        case ORDER_CODE.TICKET_TRADE://电影订单
          code = data.ticketInfo.code || '';
          break;
        default:
          break;
      }

      this.setState({
        code: code || ''
      })

     }
  }

  /**
   * 根据不同订单找出对应的券码
   */
  getCode() {
    switch (this.orderCode) {
      case ORDER_CODE.COUPON_TRADE://券订单
      case ORDER_CODE.CATERING_TRADE://餐饮订单
        this.getCouponCode();
        break;
      case ORDER_CODE.ENTITY_TRADE://实物订单
        this.getEntityCode();
        var orderStatus = this.orderDetail.orderStatus;
        if (orderStatus == 'TRADE_SUCCESS' || orderStatus == 'PAY_SUCCESS' || orderStatus == 'TRADE_FINISHED') {
          this.getEntityCode();
        }
        break;
      case ORDER_CODE.TICKET_TRADE://电影订单
        this.getMovieCode();
        break;
      case ORDER_CODE.HANXIU_TRADE: //汉秀订单
      case ORDER_CODE.LEYUAN_TRADE: //乐园订单
        this.getTicketDetail();
        break;
      default:
        break;
    }
  }


  getCouponCode() {
    this.unsubscribeCode = OrderStore.listen(this.onCodeStoreChanged.bind(this));
    OrderAction.getOrderCouponCode({
      'orderNo': this.orderId
    });
  }

  getEntityCode() {
    console.log("entity code");
    this.unsubscribeCode = OrderStore.listen(this.onCodeStoreChanged.bind(this));
    OrderAction.getOrderPickupCode({
      'orderNo': this.orderId
    })
  }

  getMovieCode() {
    this.unsubscribeCode = OrderStore.listen(this.onCodeStoreChanged.bind(this));
    OrderAction.getOrderMovieDetail({
      'orderNo': this.orderId,
      'memberId': true
    });
  }

  getTicketDetail() {
    console.log("getTicket detail")
  }

  initOtherOrder(){
    var oriProductList = this.state.orderDetail.productList || [];

    let product = [];
    let seat = [];
    var seatStr = '';
    let buyNumber = 0;
    for (var i = 0, len = oriProductList.length; i < len; i++) {
      let json = JSON.parse(oriProductList[i].productInfo);
      product[i] = {
        productInfo: json,
        productPrice: oriProductList[i].productPrice,
        productCount: oriProductList[i].productCount,
        productMainPic: oriProductList[i].picture
      };
      buyNumber += oriProductList[i].productCount;
      seat.push(json.seat);
    }
    seatStr = seat.join(" ");

    if (this.orderCode == ORDER_CODE.TICKET_TRADE) {
      product[0].productCount = len;
      product.length = 1;
    }


    return (
      product.map((item, index)=> {
        return (
          <InfoHd key={ index }>
            <InfoImg src={ IMG_HOST + item.productMainPic } imgDefault=""/>
            <InfoCont>
              <div className="order-detail">
                <div className="main-detail">
                  <p>{ item.productInfo.title }</p>
                  {(() => {
                    if(item.productInfo.attribute){
                      return(
                        <p>{ item.productInfo.attribute }</p>
                      )
                    }
                    if(this.orderCode == ORDER_CODE.TICKET_TRADE){
                      return(
                        <div className="m-font-light-grey">
                          <p>{ item.productInfo.place }</p>
                          <p>{ seatStr }</p>
                          <p>{ item.productInfo.date }</p>
                        </div>
                      )
                    }
                  })()}
                </div>
                <div className="main-detail-tip">
                  <p>&yen; { item.productPrice }</p>
                  <p>x { item.productCount }</p>
                </div>
              </div>
            </InfoCont>
          </InfoHd>
        )
      })
    )
  }

  initOrderGoods(orderCode) {
    if (!orderCode) return;

    if(orderCode == ORDER_CODE.FLASHPAY_TRADE){
      return this.initFlashPayOrder();
    }else{
      return this.initOtherOrder();
    }

  }

  initFlashPayOrder(){
    let orderDetail = this.state.orderDetail;
    return(
      <InfoHd>
        <InfoImg imgDefault={ imgSrc }/>
        <InfoCont>
          <div className="order-detail">
            <div className="main-detail">
              <p>{ orderDetail.storeName }</p>
            </div>
            <div className="main-detail-tip">
              <p>&yen; { orderDetail.orderAmt }</p>
              <p>x 1</p>
            </div>
          </div>
        </InfoCont>
      </InfoHd>
    )
  }



  render() {
    var storeIMG = this.storeDetail.storePicsrc?(IMG_HOST + this.storeDetail.storePicsrc):'';
    let orderDetail = this.state.orderDetail;
    let createOrderTime = dateformat(orderDetail.createTime * 1000, 'yyyy-mm-dd HH:MM:s');
    return (
      <div className="my-order-detail">
        <InfoBox className="order-top-item">
          <InfoHd>
            <div className="order-item">
              <span className="lf font-grey">{ ORDER_TYPE(orderDetail.orderCode) }</span>
              <span className="rt font-red">{ ORDER_STATUS[orderDetail.orderStatus] }</span>
            </div>
          </InfoHd>
          <InfoBd>
            <div className="order-item">
              <span className="lf">订单编号</span>
              <span className="rt">{ this.orderId }</span>
            </div>
            <div className="order-item">
              <span className="lf">下单时间</span>
              <span className="rt">{ createOrderTime }</span>
            </div>
          </InfoBd>
        </InfoBox>
        <InfoBox>
          <InfoHd>
            <p className="font-grey">商品信息</p>
          </InfoHd>
          { this.initOrderGoods(this.orderCode) }
          <InfoBd className="order-main-item">
            <div className="order-item">
              <span className="lf">总金额(含运费)</span>
              <span className="rt font-red">&yen;<b>{ orderDetail.orderAmt }</b></span>
            </div>
            <div className="order-item">
              <span className="lf">订单金额</span>
              <span className="rt font-red">&yen; { orderDetail.realPayAmt }</span>
            </div>
          </InfoBd>
        </InfoBox>
        <InfoBox style={{display:this.state.code?'block':'none'}}>
          <div className="order-item">
            <span className="lf font-grey">券码</span>
            <span className="rt">{ this.state.code }</span>
          </div>
        </InfoBox>
        <InfoBox style={{display:this.storeDetail.storeName?'block':'none'}}>
          <Link to={"/merchant/"+this.storeDetail.storeId}>
            <InfoHd>
              <div className="m-info-box-img"><img src={storeIMG}/></div>
              <InfoCont>
                <div className="order-detail">
                  <div className="main-detail">
                    <p>{ this.storeDetail.storeName }</p>
                    <p className="font-greyer"><i className="iconfont icon-address"></i>{ this.storeDetail.storeAddress }</p>
                    <p className="font-greyer"><i className="iconfont icon-telephone"></i>{ this.storeDetail.storePhone }</p>
                  </div>
                </div>
              </InfoCont>
            </InfoHd>
          </Link>
          <InfoHd>
            <div className="whole-width-center">
              <a className="butHollow-green arclr-button" href={"tel:"+this.storeDetail.storePhone}>联系店铺</a>
              <a className="butHollow-green arclr-button" href="tel:400-950-6677">联系果仁支付</a>
            </div>
          </InfoHd>
        </InfoBox>
      </div>
    )
  }
}

OrderDetail.defaultProps = { title: '订单详情' };
/*
*
* <div className="order-btn-wrap">
 <Button className="btn" btnState={ true }>再次购买</Button>
 </div>
*
* */

export default OrderDetail;