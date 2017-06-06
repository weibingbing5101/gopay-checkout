import React from 'react';
require('./pay.less');

import { PropTypes } from 'react-router';

import CommonAction from '../../actions/common-action';
import { Button } from '../../components/Button';
import FlashpayAction from '../../actions/flashpay-action';
import FlashpayStore from '../../stores/flashpay-store';
import UserStore from '../../stores/user-store';
import { ItemList } from '../../components/wx_ItemList';
import { lefuConfig } from '../../modules/config';

import { orderInterface } from '../../modules/data-interface';
import { detailInterface } from '../../modules/data-interface';

import { orderConfig }  from '../../modules/config';

import position  from '../../modules/position';

import { getDeviceId } from '../../modules/tools';

class Pay extends React.Component{

  constructor(props){
    super(props);

    let userInfo = UserStore.getUserInfo();
    this.uid = userInfo.uid;//TODO: uid获取方法
    this.storeId = this.props.params.storeId;//TODO: sid现在写死

    CommonAction.loading(true, '功能准备中');

    let that = this;

    detailInterface.merchantDetail({
      storeid: this.storeId,
      display_type:'json'
    }).then(function(result){
      let detail = result.detail;
      that.loadRules();
      if(!detail||!detail.plazaLatitude||!detail.plazaLongitude){
        CommonAction.loading(false);
        CommonAction.alert('门店信息有误，请选择其他门店');
        that.setState({
              buyButton: false
            })
      }else{
        CommonAction.loading(false);
        that.setState({
              distance: 1
            })
        return;
        position.getLineDistance({
          lat: detail.plazaLatitude,
          lng: detail.plazaLongitude
        }).then(function(data){
          if(!data||!data[0]||data[0]>2000*2000){
            CommonAction.loading(false);
            CommonAction.alert('门店信息有误，请选择您附近的门店');
          }else{
            that.setState({
              distance: data[0]
            })
            that.loadRules();
          }
        });
      }
    });

    this.inputValue = {//TODO:value 数字限制
      payAmt:'',
      exceptAmt:''
    };
    this.cashPay = {
      promotionCash: [0,0,0],
      amt: 0
    };
    this.flashPay = [];//接口返回的数据

    this.state={
      canUse: false,
      distance: null,

      realPayCash: '',
      showExceptRuleFlag: false,
      flashPay: [], //经过处理要渲染的数据
      buyButton: true
    }
  }

  componentDidMount() {
    this.unsubscribeRulesList = FlashpayStore.listen(this.onFlashpayChanged.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribeRulesList();
  }

  loadRules(){
    FlashpayAction.getStoreFlashpay({
      sid: this.storeId,//todo:改门店id,现在写死
      ddId: 'ffan_weixin',//todo:改ddid
      caller:'H5',
      uid: this.uid
    })
  }

  onFlashpayChanged({data, error, type}){
    if(error){
      if(type==='rulesList'){
        CommonAction.loading(false);
      }
      CommonAction.alert(error);
      return;
    }
    if(type==='rulesList'){
      CommonAction.loading(false);
      this.displayRulesList(data);
      this.setState({
        canUse: true
      })
    }else if(type==='rulesAllowUse'){
      this.displayAllowUse(data);
    }

  }

  // 初始化规则列表
  displayRulesList(data){
    let rules = data.rules;
    let promotions = rules.promotions;
    this.flashPay = promotions;

    let coupons = [];
    rules.coupons.forEach(function(rule){
      if(!rule.denyUseId){
        rule.allowUse = false;
        coupons.push(rule);
      }
    });
    this.coupons = coupons;

    this.renderRules();
  }

  // 用户进行选择后的可用列表
  displayAllowUse(data){
    let rules = data.rules;

    if(!rules){
      return;
    }
    let promotions = rules.promotions;
    if(promotions&&promotions.length){
      //重组数据
      promotions.forEach((rule,index)=>{
        rule.forEach((item,id)=>{
          for(let key in item){
            this.flashPay[index][id][key] = item[key]
          }
        })
      });
    }
    

    let allowUseCoupons = rules.coupons;
    let allowUseCouponsMap = {};
    if(allowUseCoupons&&allowUseCoupons.length){
      allowUseCoupons.map(function(rule){
        allowUseCouponsMap[rule.id] = rule;
      });
    }
    this.coupons.forEach(function(rule){
      let allowUseCoupon = allowUseCouponsMap[rule.id];
      if(allowUseCoupon){
        rule.allowUse = true;
        let cashLimit = allowUseCoupon.cashLimit;
        if(cashLimit.start!==undefined){
          cashLimit.start = parseFloat(cashLimit.start);
        }
        if(cashLimit.end!==undefined){
          cashLimit.end = parseFloat(cashLimit.end);
        }
        rule.cashLimit = cashLimit;
      }else{
        rule.allowUse = false;
      }
    });
     
    
    this.renderRules();
  }

  setFlashPay(rules, coupons, realPayCash){
    let lefuInfo=[];
    for(let i=0;i<rules.length;i++){
      let item={};
      let rulesCanUse = this.showRulesDetail(i,rules[i]);
      item.type='default';
      item.icon='icon-pay';
      item.content = ((item)=>{
        return(
          <ul className="rules-item">
            { rulesCanUse }
          </ul>
        )
      })(rules[i]);
      item.iconNext=false;
      //item.sideContent="";
      //item.clickAction=this.checkPay.bind(this);
      item.otherStyle=rulesCanUse.length<=0?"rules-disabled":'';
      lefuInfo.push(item)
    }



    (function(coupons){
      let item={};
      let rulesCanUse = this.showCouponsDetail(coupons, realPayCash);
      item.type='default';
      item.icon='icon-pay';
      item.content = (()=>{
        return(
          <ul className="rules-item">
            { rulesCanUse }
          </ul>
        )
      })();
      item.iconNext=false;
      item.otherStyle=rulesCanUse.length<=0?"rules-disabled":'';
      lefuInfo.push(item)
    }.bind(this))(coupons);

    return lefuInfo;
  }

  checkRule(item, rules){
    if(!item.allowUse){
      CommonAction.alert('无法使用此规则');
      return;
    }
    if(item.choiced===0){
      rules.forEach((rule) => rule.choiced = 0);
      //item.choiced = (item.choiced + 1)%2;
      item.choiced = 1;
    }else{
      item.choiced = 0;
    }
    
    this.renderRules(); 
  }


  // 原来数据结构设计的不合理，先这样做吧
  renderRules(){

    let realPayCash = parseFloat(this.inputValue.payAmt||0);
    this.flashPay.forEach(function(rules){
      if(rules.length){
          rules.forEach(function(rule){
            if(rule.choiced===1){
              realPayCash -= parseFloat(rule.promotionCash);
            }

          });
      }
    });

    if(realPayCash<0){
      realPayCash = 0;
    }

    if(this.inputValue.exceptAmt){
      realPayCash += parseFloat(this.inputValue.exceptAmt);
    }

    this.setState({
      flashPay: this.setFlashPay(this.flashPay, this.coupons, realPayCash)
    });


    this.setState({
      realPayCash:  realPayCash === undefined || realPayCash === '' ? '' : realPayCash.toFixed(2)
    })
  }

  showRulesDetail(level, rules){
    var aRules = [];
    rules.forEach((item,index)=>{
      let promotionInfo = item.promotionMaxMinus ? ', 最高减' + item.promotionMaxMinus + '元' : '';
      let checked = item.choiced ? 'checkbox checked' : 'checkbox';
      let promotionCash = item.promotionCash ? '- '+item.promotionCash : '';
      let allowUseClass = '';
      if(!item.allowUse){
        allowUseClass = 'disabled-use';
        promotionCash = '不可用'
      }
      if(item.denyUseId === 0){
        this.getChoiceCash(item);
        aRules.push(
          <li key={ index } className={ allowUseClass }>
            <span className="promotion-cash">{ promotionCash }</span>
            <p>{ item.promotionName + promotionInfo }</p>
            <label className="checkbox-wrap">
              <span className={ checked } onClick={ function(){ this.checkRule(item, rules) }.bind(this) }><i className="iconfont icon-duihao"></i></span>
            </label>
          </li>
        )
      }

    });
    return aRules
  }


  // 优惠券单个项详情
  showCouponsDetail(rules, realPayCash){

    var aRules = [];
    realPayCash = parseFloat(realPayCash);
    rules.forEach((item,index)=>{
      let promotionInfo = item.couponName||'优惠券';
      let promotionCash = '';
      let checked = item.choiced ? 'checkbox checked' : 'checkbox';
      let allowUseClass = 'coupon';
      let useText = '';
      let cashLimit = item.cashLimit||{ };
      if(!item.allowUse||
        (cashLimit.start&&cashLimit.start>=realPayCash)||
        (cashLimit.end&&cashLimit.end!=-1&&cashLimit.end<=realPayCash)){
        useText = '不可赠';
        allowUseClass += ' disabled-use';
      }else{
        useText = '可赠送';
      }
      aRules.push(
        <li key={ index } className={ allowUseClass }>
          <span className="promotion-cash">{ useText }</span>
          <p>{ promotionInfo }</p>
        </li>
      )
      

    });
    return aRules;
  }

  getChoiceCash(item){
    if(item.choiced){
      this.cashPay.promotionCash[item.level - 1] = item.promotionCash;
    }

  }

  showExceptRule(){
    //TODO: bug double click
    var flag = !this.state.showExceptRuleFlag;
    if(!flag){
      this.inputValue.exceptAmt = '';
      this.refs.exceptAmtInput.value = '';
      this.getRulesAllowUse();
    }
    console.log(flag);
    this.setState({
      showExceptRuleFlag: flag
    })
  }

  calcAmt(){
    let errorMsg = this.checkMoneyError();
    if(errorMsg){
      CommonAction.alert(errorMsg);
      return;
    }
    //TODO:精确减法
    let cash = this.inputValue.payAmt - this.inputValue.exceptAmt;
    if( cash < 0) {
      CommonAction.alert('您输入的总金额小于不参与优惠金额,请重新输入');
      // this.disabledAllRules();
      return;
    }

    this.createOrder();
  }

  checkMoneyError(){
    let errorMsg = '',
      money = this.inputValue.payAmt;
    if(!money){
      errorMsg = lefuConfig.MONEY_ERROR.MONEY_NULL;
    }else if(isNaN(money)||/^\./.test(money)){
      errorMsg = lefuConfig.MONEY_ERROR.MONEY_INVALID;
    }else if((money.split('.')[1]||'').length > 2 ){
      errorMsg = lefuConfig.MONEY_ERROR.MONEY_LIMIT_DECIMAL;
    }else if((money=parseFloat(money)) < 0.01 ){
      errorMsg = lefuConfig.MONEY_ERROR.MONEY_LIMIT_SMALL;
    }else if(money > 999999.99 ){
      errorMsg = lefuConfig.MONEY_ERROR.MONEY_LIMIT_MAX + 999999.99;
    }

    if(!errorMsg){
      let exceptAmt = this.inputValue.exceptAmt;
      if(exceptAmt!==undefined){
        if(isNaN(exceptAmt)||/^\./.test(exceptAmt)){
          errorMsg = lefuConfig.MONEY_ERROR.MONEY_INVALID;
        }else if((exceptAmt.split('.')[1]||'').length > 2 ){
          errorMsg = lefuConfig.MONEY_ERROR.MONEY_LIMIT_DECIMAL;
        }else if((exceptAmt=parseFloat(exceptAmt)) < 0.01 ){
          errorMsg = lefuConfig.MONEY_ERROR.MONEY_LIMIT_SMALL;
        }else if(exceptAmt > 999999.99 ){
          errorMsg = lefuConfig.MONEY_ERROR.MONEY_LIMIT_MAX + 999999.99;
        }
      }
      if(errorMsg){
        errorMsg = '不参与优惠金额错误，'+errorMsg;
      }
    }else{
      errorMsg = '消费金额错误，' + errorMsg;
    }

    return errorMsg;
  }

  getRulesAllowUse(){
    let errorMsg = this.checkMoneyError();
    if(errorMsg){
      CommonAction.alert(errorMsg);
      return;
    }
    //TODO:精确减法
    let cash = this.inputValue.payAmt - this.inputValue.exceptAmt;
    if(cash<0){
      CommonAction.alert('您输入的总金额小于不参与优惠金额,请重新输入');
      this.disabledAllRules();
      return;
    }
    FlashpayAction.getAllowUse({
      sid: this.storeId,
      uid: this.uid,
      caller: 'app',
      ddId: 'xxx',
      cash: cash
    })
  }

  disabledAllRules(){
    let rules = this.flashPay;
    rules.forEach((rule,index)=>{
      rule.forEach((item,id)=>{
        this.flashPay[index][id]['allowUse'] = 0;
        this.flashPay[index][id]['choiced'] = 0;
        this.flashPay[index][id]['promotionCash'] = '0.00'
      })
    });
    
    this.renderRules();
  }

  getAmtValue(e){
    this.inputValue.payAmt = e.target.value;
  }

  getExceptValue(e){
    this.inputValue.exceptAmt = e.target.value;
  }

  createOrder(e) {

    let tradeCode = lefuConfig.TRADE_CODE,
        totalPayCash = this.inputValue.payAmt,
        realPayCash = this.state.realPayCash,
        promotionInfos = null;

    if(this.flashPay&&this.flashPay.length){
      this.flashPay.forEach(function(rules){
        if(rules&&rules.length){
          rules.forEach(function(rule){
            if(rule.choiced){
              if(!promotionInfos){
                promotionInfos = [];
              }
              promotionInfos.push({
                "promotionAmount": rule.promotionCash,
                "desc": rule.promotionName,
                "promotionId": rule.id
              })
            }
          });
        }
      });
    }

    CommonAction.loading(true, '正在生成订单');

    orderInterface.createOrder({
      tradeCode: tradeCode,
      promotionInfos: promotionInfos,
      remark: { orderType: 'lefu' },
      storeId: this.storeId,
      buyNumber: 1,
      totalPrice: totalPayCash,
      realPay: realPayCash,
      noPreferentialPrice: this.inputValue.exceptAmt||0,
      devInfo: { 
        distance: this.state.distance,
        ua: getDeviceId()
      },
      title: '乐付买单',
      ddId: getDeviceId()
    }, UserStore.getUserInfo()).then(function(ret){
      CommonAction.loading(false);
      if (ret.status == 200) {
        if(ret.realPay == 0){
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
      CommonAction.loading(false);
      CommonAction.alert(msg);
    });

  }

  render(){
    let showExceptClass = this.state.showExceptRuleFlag ? 'rule-except show-except' : 'rule-except';
    return(
      <div className="flashpay-pay" style={{ display: this.state.canUse ? 'block' : 'none' }}>
        <div className="rule-number-wrap">
          <div className="input">
            <span>消费总额</span>
            <span className="money-amt">
              <input placeholder="请输入消费总额" onChange={ function(e) { this.getAmtValue(e) }.bind(this) } onBlur= { this.getRulesAllowUse.bind(this) }/>
            </span>
          </div>
          <div className={ showExceptClass }>
            <label className="checkbox-wrap">
              <span className="checkbox" ><i className="iconfont icon-duihao"></i></span>
              <input type="checkbox" onClick={ this.showExceptRule.bind(this) } />
              <span className="tip" >输入不参与优惠的金额 (如酒水、特价等)</span>
            </label>
            <div className="input">
              <span>不参与优惠金额</span>
              <span className="money-amt">
                <input placeholder="请输入" ref="exceptAmtInput" onChange={ function(e) { this.getExceptValue(e) }.bind(this) } onBlur={ this.getRulesAllowUse.bind(this) }/>
              </span>
            </div>
          </div>
        </div>
        <div className="rules-list">
          <ItemList data={ this.state.flashPay }/>
        </div>
        <div className="confirm-amt">
          <span>实付金额</span>
          <span className="amt">{ this.state.realPayCash }</span>
        </div>
        <div className="btn-wrap">
          <Button btnState={ this.state.buyButton } className="confirm-btn" onClick={ this.calcAmt.bind(this) }>确认购买</Button>
        </div>
      </div>
    )
  }
}

Pay.defaultProps = { title: lefuConfig.DEFAULT_PAGETITLE };

Pay.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default Pay;