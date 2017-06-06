/**
 * Created by wanghongguang on 16/3/8.
 */
import React from 'react';
import store from 'store';

import { PropTypes } from 'react-router';

import classNames from 'classnames';
import {Link} from 'react-router';

import CommonAction from '../../actions/common-action';
import OrderAction from '../../actions/order-action';
import OrderStore from '../../stores/order-store';


import { orderInterface,payInterface } from '../../modules/data-interface';
import {orderConfig} from '../../modules/config';
import { getCountDown } from '../../modules/tools';

import Button from '../../components/Form/button';

import $ from 'jquery';

require('./ui.less');

class PayOrder extends React.Component{
  constructor(props) {
    super(props);

    this.user = store.get("ffan_user");

    this.orderNo = '';
    this.orderInfo = null;
    this.realPayAmt = 0;

    this.endTime=0;
    this.serverTime=0;

    this.state={
      countDown:0,
      countDownClock: '',
      morePay:false,
      canPay:false,
      expired:false,
      payMethod:0 //0微信1财付通网页版
    };

    this.inter = null;
    this.url = null;
  }

  componentDidMount(){
    $('body').addClass('pay-order-bg');

    this.unsubscribe = OrderStore.listen(this.onStoreChanged.bind(this));
    this.loadDetail();
  }

  componentWillUnmount() {
    this.unsubscribe();
    if(this.inter){
      clearInterval(this.inter);
    }
  }


  loadDetail(){
    OrderAction.getOrderDetail({
      orderId:this.props.params.orderId||this.context.location.query.state
    });
  }

  onStoreChanged(info) {
    if (info.loading !== undefined) {
      CommonAction.loading(info.loading)
    }
    if (info.error) {
      CommonAction.alert(info.error);
    } else {
      if (info.data) {
        let order = info.data;
        this.orderInfo = order;
        this.orderInfo.orderType=order.remark?JSON.parse(order.remark).orderType:"";
        let buyNumber=0;
        for(let i= 0,len=order.productList.length;i<len;i++){
          buyNumber+=order.productList[i].productCount;
        }
        this.orderInfo.buyNumber=buyNumber;
        this.realPayAmt = order.realPayAmt;
        this.orderNo = order.orderNo;
        let expired = order.orderStatus!="INITIAL";
        if (!expired) {
          this.getOrderTime();
        }
        this.setState({
          expired: expired
        });
      }
    }
  }

  getOrderTime() {
    let orderNo = this.props.params.orderId||this.context.location.query.state;
    orderInterface.commonClock({orderNo: orderNo})
        .then(function(ret) {
          if (!ret) {
            CommonAction.alert('服务器错误，请重试');
            return;
          }
          if (ret.status == 200) {
            let timeout=ret.data.timeout;
            this.endTime=ret.data.createTime+timeout*60*1000;
            this.serverTime=ret.data.systemTime;
            this.setState({canPay: false});
            this.initCountDown();
          } else {
            CommonAction.alert('ajax failed: ' + (ret.message || ret.responseText));
          }
        }.bind(this)).
        fail(function(msg) {
          CommonAction.alert(msg);
        });
  }

  initCountDown() {
    let serverTime = this.serverTime,
        disTime=Date.now() - serverTime,
        ts=this.endTime, that = this;

    this.inter = setInterval(()=>{
      if (!ts) {
        serverTime = that.severTime;
        disTime = Date.now() - serverTime;
        ts = that.endTime;
      }
      ts += 1;
      that.setState({
        canPay: true,
        countDownClock: getCountDown(ts, disTime , "时:分:秒")
      });
      if(ts - (Date.now() - disTime)<=0){
        clearInterval(that.inter);
        that.expired=true;
        that.setState({
          canPay: false,
          expired: true
        });
      }
    },1000);
  }

  morePayClick(){
    let morePay = this.state.morePay?false:true;
    this.setState({morePay});
  }

  switchPayMethod(type) {
    this.setState({payMethod:type});
  }

  methodChange(type) {}

  confirmPay() {

    if(this.state.expired || !this.state.canPay) return;
  
    if(this.state.payMethod=="0"){
      if (typeof WeixinJSBridge == "undefined"){
        CommonAction.alert('在微信浏览器中才能使用此功能！');
      }else{
        
        this.wxPay();
      }

    } else if(this.state.payMethod=="1") {
      this.payByCFT();
    }
  }

  //微信支付
  wxPay(){
    var memberId=this.user.uid;
    if(this.url != null){
          this.onBridgeReady(this.url);
      }else {
          let code = this.context.location.query.code;
          if(!code){
             CommonAction.alert('微信支付获取授权失败，请选择其它支付。');
          }

          payInterface.getOpid(code).then(function (ret) {
              if (ret.status == 200) {
                  let ipcode = ret.data.openid;
                  payInterface.getSign(memberId,ipcode, this.orderInfo.paySequenceNo).then(function (ret) {
                      if (ret.status == 200) {
                          this.url = ret.data.url;
                          var payno = ret.data.payInstructId;
                      } else {
                          CommonAction.alert('获取微信签名失败，请重试！');
                          history.back();
                      }
                      if (typeof WeixinJSBridge == "undefined") {
                          if (document.addEventListener) {
                              document.addEventListener('WeixinJSBridgeReady', ()=>{this.onBridgeReady(this.url)}, false);
                          } else if (document.attachEvent) {
                              document.attachEvent('WeixinJSBridgeReady',()=>{this.onBridgeReady(this.url)});
                              document.attachEvent('onWeixinJSBridgeReady', ()=>{this.onBridgeReady(this.url)});
                          }
                          CommonAction.alert('请在微信中打开该网页');
                      } else {
                          this.onBridgeReady(this.url);
                      }
                  }.bind(this));
              } else {
                  CommonAction.alert('获取微信验证码失败，请重试！');
                  history.back();
              }
          }.bind(this))
          .fail(function(e){
            CommonAction.alert(e);
          });
    }
  }

  /**
   * @description 微信支付接口调用
   * @param  微信支付的参数。appId等信息
   * @return null
   */
  onBridgeReady(url){
    WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
              "appId": url.appId,     //公众号名称，由商户传入
              "timeStamp": url.timeStamp,         //时间戳，自1970年以来的秒数
              "nonceStr":  url.nonceStr, //随机串
              "package" : url.package,
              "signType" : url.signType,         //微信签名方式：
              "paySign" : url.paySign //微信签名
          },
          function(res){
              if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                  window.location.href = window.location.origin+'/view/pay_success.html';
              }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                  CommonAction.alert('支付失败，请重试'+ret.status);
                  //history.back();
              }else{
                 CommonAction.alert('支付失败，请重试'+ret.status);
                 //history.back();
              }

            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          }
      );
  }

  //财付通
  payByCFT() {
    var memberId=this.user.uid;
    var buyInfo={
      buyNumber:this.orderInfo.buyNumber,
      orderType:this.orderInfo.orderType,
      orderNo:this.orderNo
    };
    buyInfo=encodeURI(JSON.stringify(buyInfo));
    CommonAction.loading(1, '跳转中…');
    payInterface.payInSeqNo(memberId, this.orderInfo.paySequenceNo,
        encodeURIComponent(window.location.origin+'/view/pay_success.html'))
        .then(function(data) {
                //allbackFunc && callbackFunc();
              CommonAction.loading(0, '跳转中…');
                if (!data) {
                  CommonAction.alert('服务器错误，请重试');
                  return;
                }
                try {
                  var pdata = JSON.parse(data.data);
                  if (pdata.status != 200) {
                    CommonAction.alert(pdata.message || '未知服务器错误，请求超时');
                  } else {
                    window.location = pdata.data.url;
                  }

                } catch (e) {
                  CommonAction.alert('数据异常');
                  return;
                }
        }.bind(this)).
        fail(function(msg) {
          CommonAction.alert(msg);
        });
  }

  render(){
    let {countDown} = this.state;
    let m = Math.floor(countDown/60);
    let s = countDown%60;
    let cls = classNames('iconAll',{'downIcon':!this.state.morePay},{'upIcon':this.state.morePay});
    let moreBtnCls = classNames('payInfoMore', {'goods-hidden':this.state.morePay});
    let morePayCls = classNames('payBar',{'more-pay-fold':!this.state.morePay});
    return(
        <article className="pay-choose-wrapper">
          <header className="header" style={{display:'none'}}>
          </header>
          <section className="g-main">
            <form>
              <div className="mainIn">
                <div className="warningBar">
                  <i style={{display: (this.state.canPay?'':'none')}} className="iconAll timeCtrIcon"></i>
                  <span style={{display: (this.state.canPay?'':'none')}}> 请在{this.state.countDownClock}内完成支付，超时将取消订单</span>
                  <span style={{display: (this.state.expired?'':'none')}}>订单已过期，请重新下单。</span>
                </div>
                <div className="g-box">
                  <div className="m-main payBar">
                    <div className="m-left">
                      <p className="hintTex">订单号：{this.orderNo}</p>
                      <p className="payInfo fs15">应付金额</p>
                    </div>
                    <div className="m-right"><p>￥{this.realPayAmt}</p></div>
                  </div>
                  <div className="m-main payBar" style={{'borderTop':'none', borderBottom:(this.state.morePay?'none':'solid 1px #efefef')}} onClick={ function (){ this.switchPayMethod(0); }.bind(this)}>
                    <div className="m-left">
                      <p className="hintTex">支付方式</p>
                      <p className="payInfo"><i className="iconAll weChatIcon"></i> &nbsp;微信支付</p>
                    </div>
                    <div className="m-right ">
                      <div className="checkBoxBar clearfix">
                        <div className="checkBoxStyle">
                          <input type="checkbox" value="0" id="checkboxFiveInput0" checked={this.state.payMethod==0} name="pay" onChange={ function (){ this.methodChange(0); }.bind(this)}  />
                          <label htmlFor="checkboxFiveInput0" onClick={ function (){ this.switchPayMethod(0); }.bind(this)} ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{'borderTop':'none','paddingTop': '.1rem','overflow':'hidden'}} className={morePayCls} onClick={ function (){ this.switchPayMethod(1); }.bind(this)}>
                    <label className={moreBtnCls} onClick={this.morePayClick.bind(this)}>更多支付方式  <i className={cls}></i></label>
                    <div className="m-main">
                      <div className="m-left">
                        <p className="payInfo"><i className="iconAll cftIcon"></i> &nbsp;财付通网页版支付</p>
                      </div>
                      <div className="m-right ">
                        <div className="checkBoxBar clearfix">
                          <div className="checkBoxStyle">
                            <input type="checkbox" value="1" id="checkboxFiveInput1" checked={this.state.payMethod==1} name="pay" onChange={ function (){ this.methodChange(1); }.bind(this)} />
                            <label htmlFor="checkboxFiveInput1" onClick={ function (){ this.switchPayMethod(1); }.bind(this)} ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="butBox">
                  <input type="button"
                      className={"okBuyBut" + (this.state.canPay && !this.state.expired ?"":" can-not-pay")}
                      value={ this.realPayAmt +  "元  确认购买"}
                      onClick={this.confirmPay.bind(this)}
                  />
                </div>
              </div>
            </form>
          </section>

        </article>

    );
  }

}

PayOrder.defaultProps = { title: '支付订单' };

PayOrder.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default PayOrder;