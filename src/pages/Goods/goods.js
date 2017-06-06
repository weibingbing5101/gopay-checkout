/**
 * Created by wanghongguang on 16/3/1.
 */
import React from 'react';
import store from 'store';

import { PropTypes } from 'react-router';

import { globalConfig } from '../../modules/config';
import tracking from '../../modules/tracking';

import CommonAction from '../../actions/common-action';
import DetailAction from '../../actions/detail-action';
import DetailStore from '../../stores/detail-store';
import GoodsAction from '../../actions/goods-action';
import GoodsStore from '../../stores/goods-store';

import { goodsInterface } from '../../modules/data-interface';

import ImgBox from '../../components/ImgBox/base';
import ScrollToTopBtn from '../../components/ScrollToTop/top-btn';
import FailPage from '../../components/InfoPage/fail-page';
import RuleBox from '../../components/InfoBox/InfoRule';
import StoreList from '../../components/ItemList/store-list';
import DetailBox from '../../components/InfoBox/InfoDetail';
import GoodsName from './goods-name';
import PurchaseBox from './purchase-box';


import $ from 'jquery';
import _ from 'underscore';

require('./goods.less');

class Goods extends React.Component {


  constructor(props) {
    super(props);
    this.user = store.get("ffan_user");
    this.cityId=store.get('cityId');
    this.plazaId=store.get('plazaId');
    this.goodsCode = this.props.params.goodsCode;
    this.adId = this.props.params.adId;
    this.failMsg = '';
    this.goodsInfo = {
      img: '',
      num: -1,
      title: '',
      goodsState: '',
      clockText: '',
      detail: '',
      stockPriceSkus: [],
      promotion: {},
      stores: []
    };
    this.goodsDetail = {};
    this.countDownClock = -1;
    this.leftTime = 0;
    this.before = null;
    this.now = null;
    this.merchantName = '';
    this.storeInfo = {}; //所属门店的详情，异步读取
    this.state = {
      isNewUserGoods: false,
      flashSaleStep: 0, //0未开始，1再进行，2已结束
      doneLoadingDetail: false,
      doneLoadingStock: false,
      canBuy: false,
      btnText: '立即抢购'
    }
  }

  componentDidMount() {
    $('body').addClass('goods-bg-grey');
    this.loadDetail();
    this.unsubscribe = GoodsStore.listen(this.onStoreChanged.bind(this));
    this.unsubscribeStore = DetailStore.listen(this.onGetScore.bind(this));
    GoodsStore.saveGoodsPageState('skuMenuShow', false);
  }

  componentWillUnmount() {
    $('body').removeClass('goods-bg-grey');
    this.unsubscribe();
    this.unsubscribeStore();
    clearInterval(this.countDownClock);
  }

  loadDetail(){
    GoodsAction.getGoodsDetail({
      flashsale: this.adId?'1':'0',
      id:this.goodsCode,
      adId:this.adId,
      cityId:this.cityId,
      plazaId:this.plazaId,
      display_type:'json'
    })
  }

  getStockLeft(promotion, goodsSn){
    var ifRiskCenter = promotion.ifRiskCenter;
    var params = [{
      "subCode": promotion.promotionCode,
      "subType": 5,
      "goodsSn": goodsSn
    }];
    params = encodeURI(JSON.stringify(params));

    goodsInterface.goodsFlashSaleStockLeft({ifRiskCenter: ifRiskCenter, params: params})
      .then(function(ret) {
          if (!ret) {
            CommonAction.alert('服务器错误，请重试');
            return;
          }
          if (ret.status == 0 || ret.status == 200 || ret.stats == 304) {
            try {
              var pdata = JSON.parse(ret.data[0]);
            } catch (e) {
              CommonAction.alert('数据异常');
              return;
            }
            this.goodsInfo.num = pdata.num;
            this.setState({doneLoadingStock: true});
            this.updateBtnAndTime();
          } else {
            CommonAction.alert('ajax failed: ' + (ret.message || ret.responseText));
          }
    }.bind(this)).
      fail(function(msg) {
      CommonAction.alert(msg);
    });
  }

  getStockLeftBySkus(skus) {
    skus = skus || [];
    let totalStock = 0;
    _.each(skus, function(sku){
      totalStock += (Number(sku.stockNum) + Number(sku.lockNum));
    });
    this.goodsInfo.num = totalStock;
    this.setState({doneLoadingStock: true});
    this.updateBtnAndTime();
  }

  intervalFun(init) {
    let leftTime = this.leftTime;
    if (leftTime > 0) {
      var text,
          second = Math.floor(leftTime  % 60),
          minutes = Math.floor(leftTime / 60 % 60),
          hour = Math.floor(leftTime  / 60 / 60);

      if (hour >= 24) {
        text = Math.floor(hour / 24) + "天" + ("" + hour % 24).slice(-2) + "时";
      } else {
        text = ("" + hour % 24).slice(-2) + "时" ;
      }
      text += ("" + minutes).slice(-2) + "分" + ("" + second).slice(-2) + "秒";
      this.goodsInfo.clockText = '仅剩' + text + (this.state.flashSaleStep == 0 ? '开售':'结束');
      this.setState({});
      if (init) {
        this.before = new Date();
      }
      this.now = new Date();
      var elapsedTime = (this.now.getTime() - this.before.getTime());

      if(elapsedTime >= 2000) {
        if (elapsedTime >= 60000) {
          clearInterval(this.countDownClock);
          location.reload();
        }
        this.leftTime -= Math.floor(elapsedTime/1000);
      }
      else {
        this.leftTime -= 1;
      }
      this.before = this.now;
    } else {
      if (this.state.flashSaleStep == 0) {
        this.goodsInfo.promotion.serverTime = this.goodsInfo.promotion.startTime + 1;
      } else if (this.state.flashSaleStep == 1) {
        this.goodsInfo.promotion.serverTime = this.goodsInfo.promotion.endTime + 1;
      } else {}
      clearInterval(this.countDownClock);
      this.goodsInfo.clockText = '';
      this.setState({});
      this.updateBtnAndTime();
    }

  }

  updateBtnAndTime() {
    if (this.adId) { //传入的参数包含活动编号
      let promo = this.goodsInfo.promotion;
      if (promo.promotionCode) {
        if (this.goodsInfo.num > 0) {
          if (promo.promotionType == 1) {
            //新用户专区商品
            this.setState({isNewUserGoods: true, canBuy: true, btnText: '立即抢购'});
          } else {
            //闪购商品
            let [startTime, endTime, serverTime] = [promo.startTime, promo.endTime, promo.serverTime];
            if (serverTime < startTime) {
              //活动未开始
              this.setState({flashSaleStep:0, canBuy: false, btnText: '即将开始'});
              this.leftTime = parseInt((startTime-serverTime)/1000);
              clearInterval(this.countDownClock);
              this.before = new Date();
              this.intervalFun(true);
              this.countDownClock = setInterval(function(){this.intervalFun()}.bind(this), 1000);
            } else if (serverTime < endTime) {
              //活动在进行
              this.setState({flashSaleStep:1, canBuy: true, btnText: '立即抢购'});
              this.leftTime = parseInt((endTime-serverTime)/1000);
              clearInterval(this.countDownClock);
              this.before = new Date();
              this.intervalFun(true);
              this.countDownClock = setInterval(function(){this.intervalFun()}.bind(this), 1000);
            } else {
              //活动结束
              this.goodsInfo.clockText = '活动已结束';
              this.setState({flashSaleStep:2, canBuy: false, btnText: '立即抢购'});
            }
          }
        } else {
          this.setState({canBuy: false, btnText: '已抢光'});
        }
      } else {
        this.goodsInfo.clockText = '活动已结束';
        this.setState({canBuy: false, btnText: '立即抢购'});
      }
    } else { //普通商品
      if (this.goodsInfo.num > 0) {
        this.goodsInfo.goodsState = '';
        this.setState({canBuy: true, btnText: '立即抢购'});
      } else {
        this.goodsInfo.goodsState = '开业筹备中，敬请期待。';
        this.setState({canBuy: false, btnText: '立即抢购'});
      }
    }
  }

  onStoreChanged(info) {
    if (info.loading !== undefined) {
      CommonAction.loading(info.loading)
    }
    if (info.error) {
      CommonAction.alert(info.error);
    } else {
      if (info.data) {
        let detail = info.data.goods_detail;
        this.goodsDetail = detail;
        if (!detail.goods) {
          this.failMsg = '不存在该商品';
          $('body').removeClass('goods-bg-grey').addClass('fail-page-bg');
          this.setState({doneLoadingDetail: true});
          return;
        }
        this.merchantName = detail.goods.publisherMerchantName;
        this.goodsInfo.img = detail.goodsPics && detail.goodsPics.length > 0 ? detail.goodsPics[0].pic: '';
        this.goodsInfo.title =  detail.goods.name;
        this.goodsInfo.detail = '<div>' + detail.goods.mobileContent + '</div>';
        this.goodsInfo.stockPriceSkus = detail.goodsStockpriceSkus;
        if (detail.goods.promotion && detail.goods.promotion.length > 0 ) {
          this.goodsInfo.promotion = detail.goods.promotion[0];
        } else {

        }
        if (info.data.isOpenCached == '1') {
          this.getStockLeft(this.goodsInfo.promotion, detail.goods.goodsSn);
        } else {
          this.getStockLeftBySkus(this.goodsInfo.stockPriceSkus);
        }
        this.goodsInfo.stores = detail.goodsScopes;
        if (this.goodsInfo.stores && this.goodsInfo.stores.length > 0) {
          this.loadStore(this.goodsInfo.stores[0].outlet);
        }

        this.setState({doneLoadingDetail: true});
      }
    }
  }

  loadStore(storeId) {
    DetailAction.getMerchantDetail({
      storeid:storeId,
      display_type:'json'
    });
  }

  onGetScore(info){
    if(info.data && info.data.detail){
      this.storeInfo = info.data.detail;
      this.setState({});
    }
  }



  render() {
    return (
      <div>
        <ScrollToTopBtn></ScrollToTopBtn>
        <ImgBox img={this.goodsInfo.img} stockLeft={this.goodsInfo.num}></ImgBox>
        <PurchaseBox goodsCode={this.goodsCode} canBuy={this.state.canBuy} stockLeft={this.goodsInfo.num} btnText={this.state.btnText} title={this.goodsInfo.title}
            skus={this.goodsInfo.stockPriceSkus} id={this.goodsCode} adId={this.adId} promotion={this.goodsInfo.promotion}
            goodsState={this.goodsInfo.goodsState} clockText={this.goodsInfo.clockText}
            user={this.user} goodsDetail={this.goodsDetail} countDownClock={this.countDownClock} ></PurchaseBox>
        <GoodsName name={this.goodsInfo.title}></GoodsName>
        <RuleBox detail={this.goodsDetail}></RuleBox>
        <StoreList list={this.goodsInfo.stores} merchantName={this.merchantName} storeInfo={this.storeInfo}></StoreList>
        <DetailBox detailText={this.goodsInfo.detail}></DetailBox>
        <FailPage msg={this.failMsg}></FailPage>
      </div>
    );
  }

}


//默认属性
Goods.defaultProps = { title: '商品详情' };


Goods.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default Goods;
