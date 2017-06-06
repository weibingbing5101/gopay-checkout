/**
 * Created by wanghongguang on 16/3/10.
 * 商品详情页中的价格区域，主要的互动区
 */

import React from 'react';

import { PropTypes } from 'react-router';

import GoodsPrice from './goods-price';
import GoodsButton from './goods-btn';
import GoodsCountDown from './goods-countdown';
import GoodsSkuBox from './goods-sku-box';

import { goodsInterface } from '../../modules/data-interface';

import CommonAction from '../../actions/common-action';
import GoodsStore from '../../stores/goods-store';

import $ from 'jquery';
import _ from 'underscore';

require('./purchase-box.less');

class PurchaseBox extends React.Component {


  constructor(props) {
    super(props);
    this.img = '';
    this.price = 0;
    this.stockNum = 0;
    this.skuAttrs = [];
    this.scopeAttr = {};
    this.productId = null;
    this.buyNumber = 1;
    this.prevBuyNumber = 1;
    this.goodsCode = this.props.goodsCode;

    this.state = {
      numberMin: false,
      numberMax: false,
      isFlashSale: false,
      skuMenuShow: false,
      attrLoadingDone:false,
      limitBuyNumber:1,
      totalCut:0,
      commonGoods:(this.props.adId?false:true)
    };
  }

  showSku() {
    if (!this.props.canBuy || this.props.stockLeft<=0) {
      return;
    }
    var that = this;
    var riskControlPass=1;
    if(this.props.user && this.props.user.uid && this.props.adId){
      goodsInterface.checkUserLimit(
          { memberId: 'memberId',
            goodsCode:this.props.goodsDetail.goods.code ,
            promotionCode:this.props.adId})
          .then(function (ret) {
            if(ret.status!=200){
              riskControlPass=0;
              CommonAction.alert(ret.message);
            }
            if(!riskControlPass) return;
            that.setState({skuMenuShow: true});
          }).fail(function(msg){
            CommonAction.alert(msg);
          });
    }else{
      that.setState({skuMenuShow: true});
    }
  }

  calcuTotalInfo (goodsObj, promo) {
    var promotionPrice = promo ? promo.totalCutAmount : 0;
    var priceArr = [];
    var totalStockNum = 0;
    var lockNum = 0;
    for (var key in goodsObj) {
      priceArr.push(goodsObj[key].price);
      totalStockNum += goodsObj[key].stockNum;
      lockNum += goodsObj[key].lockNum;
    }
    priceArr = priceArr.sort();
    var minPrice = priceArr[0];
    var maxPrice = priceArr[priceArr.length - 1];
    if (minPrice != maxPrice) {
      return {
        totalNum: totalStockNum - lockNum,
        totalPrice: (minPrice - promotionPrice).toFixed(2) + "--" + (maxPrice - promotionPrice).toFixed(2)
      }
    } else {
      return {
        totalNum: totalStockNum - lockNum,
        totalPrice: (maxPrice - promotionPrice).toFixed(2)
      }
    }
  }

  componentDidMount() {
    this.unsubscribe = GoodsStore.listen(this.onStoreChanged.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStoreChanged() {
    let detail = GoodsStore.goodsDetail;
    if (detail.goods_detail && detail.goods_detail.goods && this.goodsCode == detail.goods_detail.goods.code) {
      let gDetail = detail.goods_detail;
      if (gDetail.goodsPics) {
        this.img = gDetail.goodsPics[0].pic;
      }
      if (!this.state.attrLoadingDone) {
        this.showAttr(gDetail);
      }
      if (gDetail.goods) {
        let goods = gDetail.goods;
        let promo = {};
        if (goods.promotion && goods.promotion.length >0) {
          promo = goods.promotion[0];
          if (promo.promotionType == 0) {
            this.setState({isFlashSale:true});
          }
        }

        if(this.state.commonGoods) {
          let totalInfo = this.calcuTotalInfo(gDetail.goodsStockpriceSkus, promo);
          this.setState({limitBuyNumber:totalInfo.totalNum});
        } else {
          this.setState({limitBuyNumber:goods.perPersonGoodsLimitNum});
          if (!this.state.isFlashSale || this.state.limitBuyNumber) {
            this.setState({numberMin:true, numberMax: true});
          }
        }
      }

      this.setState({});
    }
  }

  //闪购商品 获取规格库存
  getGoodsStockpriceSkus(ret) {
    var goodsStockpriceSkus = [];
    var goodsStock = ret.data.goodsStockpriceSkus;
    for (var i = 0; i < goodsStock.length; i++) {
      var goodsSkus = goodsStock[i].goodsSkus;
      var ids = [];
      for (var key in goodsSkus) {
        ids.push(goodsSkus[key].value)
      }
      goodsStockpriceSkus[ids.join("_")] = goodsStock[i]
    }
    return goodsStockpriceSkus;
  }

  hideSku() {
    this.setState({skuMenuShow: false});
  }

  showAttr(goodsDetail){
    var that = this;
    let promotionPrice = goodsDetail.goods && goodsDetail.goods.promotion ? goodsDetail.goods.promotion[0].totalCutAmount : 0;
    that.setState({totalCut: promotionPrice});
    if (!this.state.attrLoadingDone && !this.productId) {
      for (let key in goodsDetail.attrs) {
        this.scopeAttr[goodsDetail.attrs[key].id] = goodsDetail.attrs[key].attrValues[0]['id'].toString();
      }
      if (goodsDetail.goods) {
        that.refreshAttrSku(goodsDetail.goods.code);
      }
    }
  }

  //设置普通商品的规格库存
  setCommonGoodsAttr(detail){
    //TODO: 需调用查普通商品库存的接口
    var goodsStockpriceSkus = detail.goodsStockpriceSkus;
    this.skuAttrs = detail;
    var ckey = [];
    for (var key in this.scopeAttr) {
      ckey.push(this.scopeAttr[key]);
    }
    var csku = goodsStockpriceSkus[ckey.join("_")+"_"];
    if (!csku) {
      csku = goodsStockpriceSkus[""];
    }
    this.price = (csku.price).toFixed(2);
    this.stockNum = csku.stockNum;
    this.productId = csku.id;
  }

  refreshAttrSku(goodsCode) {
    let that = this;
    let param = {};
    if (!this.props.adId) {
      this.setCommonGoodsAttr(GoodsStore.goodsDetail.goods_detail);
      that.setState({attrLoadingDone: true});
      return;
    } else {
      param = {
        "payType": 3,
        "goodsCode": goodsCode,
        "adId": this.props.adId
      };
    }
    goodsInterface.getAttrSku(param)
        .then(function (ret) {
          var goodsStockpriceSkus = that.getGoodsStockpriceSkus(ret);
          that.skuAttrs = ret.data;
          var ckey = [];
          for (var key in that.scopeAttr) {
            ckey.push(that.scopeAttr[key]);
          }
          var csku = goodsStockpriceSkus[ckey.join("_")];
          if (!csku) {
            csku = goodsStockpriceSkus[""];
          }
          that.price = (csku.price - that.state.totalCut).toFixed(2);
          that.stockNum = csku.stockNum;
          that.productId = csku.id;
          that.setState({attrLoadingDone: true});
        })
  }

  changeNumber(num) {
    if ((!this.state.isFlashSale || this.state.limitBuyNumber == 1) && !this.state.commonGoods) {
      return;
    }
    this.buyNumber += num;
    if (this.buyNumber <= 1 && num == -1) {
      this.setState({numberMin: true});
      this.buyNumber = 1;
    } else {
      this.setState({numberMin: false});
    }

    if ((this.buyNumber >= this.stockNum || this.buyNumber >= this.state.limitBuyNumber) && num == 1) {
      this.setState({numberMax: true});
      this.buyNumber = this.stockNum > this.state.limitBuyNumber ? this.state.limitBuyNumber : this.stockNum;
    } else {
      this.setState({numberMax: false});
    }
    this.setState({});
  }

  changeHandler(e){
    let newValue = e.target.value;
    let maxNumber = this.state.limitBuyNumber;

    newValue = $.trim(newValue);

    if (newValue != '') {
      if (!/^\d+$/.test(newValue)) {
        CommonAction.alert('输入必须为纯数字', true);
        this.buyNumber = this.prevBuyNumber;
        return;
      }
      newValue = ~~newValue;
      if(newValue===0){
        CommonAction.alert('购买数量必须大于0', true);
        this.buyNumber = 1;
      }else if(newValue >= maxNumber){
        CommonAction.alert('最大限购数量为：'+maxNumber, true);
        this.buyNumber = maxNumber;
      }else{
        this.buyNumber = newValue;
      }
      this.prevBuyNumber = this.buyNumber;
    } else {
      this.buyNumber = '';
      this.prevBuyNumber = '';
    }

    this.setState({});
  }

  gotoConfirm() {

    if (!this.buyNumber) {
      CommonAction.alert('请输入购买数量', true);
      return;
    }
    if (!this.stockNum) return;
    var createOrderUrl;
    if (this.state.commonGoods) {
      createOrderUrl = '/createOrderFast/' + this.props.id + '/' + this.productId + '/' + this.price + '/' + this.buyNumber + '/' + '';
    } else {
      createOrderUrl = '/createOrderFast/' + this.props.id + '/' + this.productId + '/' + this.price + '/' + this.buyNumber + '/' + this.props.adId;
    }
    if (!this.props.user) {
      clearInterval(this.props.countDownClock);
      this.context.history.pushState(null, '/me/login', {
        redirectUrl: createOrderUrl
      });
      return;
    }
    clearInterval(this.props.countDownClock);
    this.context.history.pushState(null, createOrderUrl);

  }

  handleSkusSelect(e, attrId) {
    this.scopeAttr[attrId] = e.target.value;
    this.refreshAttrSku(this.props.goodsDetail.goods.code);
  }

  render() {

    let cls = this.props.goodsDetail.goods ? '': 'goods-hidden';
    return (
      <div className={cls}>
        <div className="purchase-box">
          <div className="m-detail-submit">
            <div className="detail-price">
              <GoodsPrice skus={this.props.skus} promotion={this.props.promotion} ></GoodsPrice>
              <GoodsCountDown goodsDetail={this.props.goodsDetail} clockText={this.props.clockText} adId={this.props.adId} promotion={this.props.promotion} goodsState={this.props.goodsState}></GoodsCountDown>
            </div>
            <GoodsButton goodsDetail={this.props.goodsDetail} text={this.props.btnText} onClick={ function (){ this.showSku(); }.bind(this) } canBuy={this.props.canBuy}></GoodsButton>
          </div>
        </div>
        <GoodsSkuBox skuAttrs={this.skuAttrs} scopeAttr={this.scopeAttr} stockNum={this.stockNum}
            isFlashSale={this.state.isFlashSale} skuMenuShow={this.state.skuMenuShow} commonGoods={this.state.commonGoods}
            attrLoadingDone={this.state.attrLoadingDone} img={this.img} price={this.price} buyNumber={this.buyNumber}
            numberMin={this.state.numberMin} numberMax={this.state.numberMax}
            hideSku={function(){this.hideSku()}.bind(this)} gotoConfirm={function(){this.gotoConfirm()}.bind(this)}
            changeNumber={function(add){this.changeNumber(add)}.bind(this)} handleSkusSelect={function(e, attrId){this.handleSkusSelect(e, attrId)}.bind(this)}
            changeHandler={ function (e){ this.changeHandler(e); }.bind(this) }  goodsDetail={this.props.goodsDetail}>
        </GoodsSkuBox>
        </div>
    );
  }
}

PurchaseBox.contextTypes = {
  history: PropTypes.history,
  location: PropTypes.location
};

export default PurchaseBox;



