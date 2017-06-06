import React from 'react';
import store from 'store';

import dateformat from 'dateformat';
import { PropTypes } from 'react-router';

import { globalConfig } from '../../modules/config';
import tracking from '../../modules/tracking';

import CommonAction from '../../actions/common-action';
import DetailAction from '../../actions/detail-action';
import DetailStore from '../../stores/detail-store';
import CommentAction from '../../actions/comment-action';
import CommentStore from '../../stores/comment-score';
import FlashpayAction from '../../actions/flashpay-action';
import FlashpayStore from '../../stores/flashpay-store';

import MerchantHead  from '../../components/Merchant/merchant-head';
import { ItemList, GoodsList } from '../../components/wx_ItemList';
import OptionItem from '../../components/Merchant/merchant-option-item';
import Confirm from '../../components/Confirm/confirm';
import { BtnRadius } from '../../components/Button'

require('./merchant.less');
const stareOk = require('./img/star_b.png');
const stare = require('./img/star_k.png');


class Merchant extends React.Component{

  constructor(props) {
    super(props);

    //this.storeId=this.props.location.query.storeId;
    //this.cityId=store.get('cityId');
    //this.plazaId=store.get('plazaId');
    this.storeId=this.props.params.storeId;
    this.uid=store.get('ffan_user')?store.get('ffan_user').uid:'';

    this.enableFlashPay=0;
    this.enableQueue=0;
    this.enableCoupon=0;
    this.enableActivity=0;

    this.merchantDetail={
      merchantInfo:{
        img:""
      },
      storeInfo:{
        plazaName:'',
        storeAddress:'',
        storeFloor:'',
        storeBunkNo:''
      },
      coupon:[],
      activity:[]
    };

    this.state={
      flashPay:[],//乐付规则列表
      flashPayCoupons: [],
      confirmContent:"",
      showConfirm:{display:"none"},
      merchantScored: 4,//默认门店星级
      showMoreRules:false,//默认规则收起
      canFlashPay:false//默认无买单优惠可用
    };
  }

 componentDidMount() {
   this.loadDetail();
   this.unsubscribe = DetailStore.listen(this.onStoreChanged.bind(this));
   this.unsubscribeComment = CommentStore.listen(this.onGetScore.bind(this));
   this.unsubscribeRulesList = FlashpayStore.listen(this.onFlashpayChanged.bind(this));
 }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeComment();
    this.unsubscribeRulesList();
  }

  onGetScore(info){
    if(info.data){
      this.setState({
        merchantScored: info.data.averageScore || 4
      })
    }
  }

  loadDetail(){
    DetailAction.getMerchantDetail({
      storeid:this.storeId,
      display_type:'json'
    });
    CommentAction.getMerchantScore({
      reviewObjectId: this.storeId,
      params: {
        objectTypeId: 3
      }
    });
    FlashpayAction.getStoreFlashpay({
      sid: this.storeId,//todo:改门店id
      ddId: 'ffan_weixin',
      caller:'H5',
      uid: this.uid
    })
  }

  onFlashpayChanged({data, error}){
    if(error){
      CommonAction.alert(error);
      return;
    }
    if(data){
      var canFlashPay = false;
      let aRules = data.rules.promotions;//[[xxx],[xxxx]]
      this.enableFlashPay = data.enableFlashPay;

      if(aRules.length) {
        Array.prototype.push.apply(aRules[0], aRules[1])
          aRules[0].forEach((item) => {
            if(item.denyUseId === 0){
              canFlashPay = true;
              return
            }
        });
      }
      //console.log(aRules)

      let coupons  = data.rules.coupons;

      this.setState({
        flashPay: this.setFlashPay(aRules[0] || [], coupons),
        canFlashPay: canFlashPay
      })

    }
    if(error){
      CommentAction.alert(error)
    }
  }

  onStoreChanged(info){
    if(info.loading!==undefined){
      CommonAction.loading(info.loading)
    }
    if(info.error){
      CommonAction.alert(info.error);
    }else{
      if(info.data){
        let detail=info.data;
        let storeInfo={
          plazaName:detail.detail.plazaName?detail.detail.plazaName:'',
          plazaLatitude:detail.detail.plazaLatitude,
          plazaLongitude:detail.detail.plazaLongitude,
          storeAddress:detail.detail.storeAddress?detail.detail.storeAddress:'',
          storePhone:detail.detail.storePhone,
          storeFloor:detail.detail.storeFloor || "",
          storeBunkNo:detail.detail.storeBunkNo
        };

        this.enableQueue=detail.detail.businessType == 3 && detail.detail.supportSmartQueue;
        this.enableCoupon=detail.coupon.datas.length>0;
        this.enableActivity=detail.activity.datas.length>0;

        this.merchantDetail.coupon=this.getList(detail.coupon.datas,detail.activity.datas).coupons;
        this.merchantDetail.activity=this.getList(detail.coupon.datas,detail.activity.datas).activities;
        this.merchantDetail.merchantInfo={
          img:detail.detail.storePicsrc,
          title:detail.detail.storeViewName,
          bgPic:detail.detail.bgPic
        };
        this.merchantDetail.storeInfo=storeInfo;

        this.setState({});
      }
    }
  }

  getList(coupons,activities){
    var aCoupon=[], aActivity=[];
    coupons.map( (coupon)=>{
      aCoupon.push({
        url:'',
        img:'http://img1.ffan.com/norm_120/'+ coupon.icon,
        title:coupon.title,
        content:
          <div>
            <em>&yen;{ coupon.sale_price }</em><del>&yen; { coupon.ori_price }</del>
            <p className="coupon-sale">已售{ coupon.sale_num }</p>
          </div>
      })
    } );
    activities.map( (activity)=>{
      aActivity.push({
        url:'',
        img:'http://img1.ffan.com/norm_120/'+ activity.icon,
        title:activity.title,
        content:
          <div className="m-font-light-grey">
            活动日期：{ dateformat(activity.begin_time_l,'yyyy.mm.dd') } - { dateformat(activity.end_time_l,'yyyy.mm.dd') }
          </div>
      })
    });
    return {
      coupons:aCoupon,
      activities:aActivity
    };
  }

  setFlashPay(rules, coupons){
    let lefuInfo=[];
    for(let i=0;i<rules.length;i++){
      var item={};
      let promotionMax = rules[i].promotionMaxMinus?(
        <span className="promotion-max">最高减{ parseFloat(rules[i].promotionMaxMinus) }元</span>
      ):(
        ''
      );
      let saleStatus = rules[i].denyUseId !== 0 ? (
        <span className="sale-status">{ rules[i].denyUseRemark }</span>
      ):('');
      item.type='default';
      item.icon='icon-pay';
      item.content=((rules)=>{
        return (
          <div className="flashpay-rule">
            <p><span className="rule-tit">{ rules[i].promotionName }</span>{ promotionMax }</p>
            <p className="limit">
              <span>累计买单{ rules[i].paidOrderNum }</span>
              <span className="stock">{ rules[i].dayLeftoverNum?'剩余'+rules[i].dayLeftoverNum:'' }</span>
              { saleStatus }
            </p>
          </div>
        )
      })(rules);
      item.iconNext=true;
      item.sideContent="";
      item.clickAction=this.checkPay.bind(this);
      item.otherStyle="flashpay-item";
      lefuInfo.push(item)
    }

    lefuInfo.push.apply(lefuInfo, this.setFlashPayCoupons(coupons));

    return lefuInfo;
  }

  setFlashPayCoupons(coupons){
    let lefuInfo=[];
    coupons.forEach(function(coupon){
      var item={};
      let saleStatus = coupon.denyUseId !== 0 ? (
        <span className="sale-status">{ coupon.denyUseRemark }</span>
      ):('');
      item.type='default';
      item.icon='icon-lefu-coupon';
      item.content=((coupon)=>{
        return (
          <div className="flashpay-rule">
            <p><span className="rule-tit">{ coupon.couponName }</span></p>
            <p className="limit">
              <span>累计买单{ coupon.paidOrderNum }</span>
              <span className="stock">{ coupon.dayLeftoverNum?'剩余'+ coupon.dayLeftoverNum:'' }</span>
              { saleStatus }
            </p>
          </div>
        )
      })(coupon);
      item.iconNext=true;
      item.sideContent="";
      item.clickAction=this.checkPay.bind(this);
      item.otherStyle="flashpay-item";
      lefuInfo.push(item)
    }.bind(this));
    
    return lefuInfo;
  }



  /**
   * 支付跳转
   */
  pay(){
    //console.log("gotopay");
    //window.location="/lefu/index?merchantId="+this.storeId;
    //window.location=globalConfig.v1_HOST+"/lefu/index?merchantId="+this.storeId;
    this.toFlashPay();
  }

  /**
   * confirm dialog
   */
  popConfirm(str){
    this.setState({
      confirmContent:str,
      showConfirm:{
        display:"block"
      }
    });
  }

  checkPay(){
    console.log('checkrule');
    !this.state.canFlashPay ? this.popConfirm("很抱歉，无买单优惠可用~") : this.toFlashPay();
  }

  /**
   * click action 点击 乐付买单 按钮
   */
  //TODO: 点击乐付买单按钮
  toFlashPay(){
    console.log('可用,进入买单界面');
    this.context.history.pushState(null,'/flashpay/' + this.storeId);

  }



  cancelFunc(){
    console.log("cancelFunc")
  }

  onChildChanged(){
    this.setState({
      confirmContent:"",
      showConfirm:{
        display:"none"
      }
    });
  }

  toDetailMore(){
    //window.location=globalConfig.v1_HOST+"/merchant/moreDetail/"+this.storeId;
    this.context.history.pushState(null,'/merchant/'+this.storeId+'/more')
  }

  toQueue(){
    window.location=globalConfig.v1_HOST+"/queue/queueInfo/"+this.storeId;
  }

  toRule(){
    /*$location.path("activity/rules/flashpay/"+vm.activityId).search({
      "sid":vm.storeId
    })*/
    window.location=globalConfig.v1_HOST+"activity/rules/flashpay/"+this.activityId+'?sid='+this.storeId;
  }

  initUI(type){
    switch (type){
      case 'coupon':
        if(this.enableCoupon){
          return(
            <GoodsList data={ this.merchantDetail.coupon } title="优惠券"/>
          )
        }
        break;
      case 'activity':
        if(this.enableActivity){
          return(
            <GoodsList data={ this.merchantDetail.activity } title="活动"/>
          )
        }
        break;
      case 'flashpay':
        if(this.enableFlashPay){
          let itemTitle = (<div>
            <span>乐付买单</span>
            <i onClick={ this.toRule.bind(this) } className="iconfont icon-wenhao"/>
            <BtnRadius onClick={ this.checkPay.bind(this) } className="lefu-btn">乐付买单</BtnRadius>
          </div>);
          return(
            <div className="lefu-box" style={{'height': this.state.showMoreRules?'auto':'246px'}}>
              <ItemList data={ this.state.flashPay } itemTitle={ itemTitle }/>
              { this.state.flashPay.length > 2 &&  <p className="show-more" onClick={ this.showMoreRules.bind(this) }>{ this.state.showMoreRules?'点击隐藏':'点击查看更多' }</p> }
            </div>
          )
        }
        break;
      case 'queue':
        if(this.enableQueue){
          let queueData = [{
            type:'default',
            icon:"icon-line",
            content:"排队等号",
            iconNext:true,
            clickAction:()=>{
              window.location="/";
            }
          }];
          return(
            <ItemList data = { queueData } />
          )
        }
        break;
      default :
        return '';
        break
    }
  }

  displayScore(scored){
    let allScore = 5;
    let stars=[];
    for(let i=0;i<scored;i++){
      stars.push(<img key={ i } src = { stareOk }  />)
    }
    for(let i=0;i<allScore-scored;i++){
      stars.push(<img key={ scored+i } src = { stare }  />)
    }
    return stars
  }

  showMoreRules() {
    this.setState({
      showMoreRules: !this.state.showMoreRules
    })
  }

  render(){
    let merchantHeadInfo = [{
      img:this.merchantDetail.merchantInfo.img?'http://img1.ffan.com/norm_120/'+ this.merchantDetail.merchantInfo.img:'',
      title:this.merchantDetail.merchantInfo.title,
      content:
        <div>
          <p className="stars">{ this.displayScore(this.state.merchantScored) }</p>
        </div>
    }];
    let merchantTel = 'tel:'+this.merchantDetail.storeInfo.storePhone;

    return(
      <div>
        <div className="detail-wrap">
          <div className="merchant-head">
            <GoodsList data={ merchantHeadInfo } title=""/>
            <div className="address">
              <p className="lf">{ this.merchantDetail.storeInfo.plazaName+''+this.merchantDetail.storeInfo.storeAddress+'  '+this.merchantDetail.storeInfo.storeFloor + '' + this.merchantDetail.storeInfo.storeBunkNo}</p>
              <a href={ merchantTel }><span className="rt"><i className="rt iconfont icon-telephone" /></span></a>
            </div>
            { this.initUI("queue") }
          </div>
          { this.initUI("flashpay") }
          { this.initUI("coupon") }
          { this.initUI("activity") }
          <div style={ this.state.showConfirm }>
            <Confirm confirmContent={ this.state.confirmContent }  cancel={ this.cancelFunc } submit={ this.pay.bind(this) } callbackParent={ this.onChildChanged.bind(this) }>
              <button>取消</button>
              <button>原价买单</button>
            </Confirm>
          </div>
        </div>
      </div>

    )
  }
}

Merchant.defaultProps = {
  title: "门店详情"
};
Merchant.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default Merchant;