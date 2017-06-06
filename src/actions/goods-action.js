/**
 * Created by wanghongguang on 16/3/4.
 */
import Reflux from 'reflux';

//数据请求模块
import { goodsInterface } from '../modules/data-interface';

const GoodsAction = Reflux.createActions(
    [
      {
        'getGoodsDetail':{children:['completed', 'failed']}
      },
      {
        'goodsFlashSaleStockLeft':{children:['completed', 'failed']}
      },
      {
        'createGoodsOrder': {children:['completed', 'failed']}
      }
    ]
);

//商品详情
GoodsAction.getGoodsDetail.listen(function (data) {
  goodsInterface.goodsDetail(data)
      .then(function (result) {
        this.completed(result);
      }.bind(this))
      .fail(function (msg) {
        this.failed(msg)
      }.bind(this))
});

//获取闪购剩余库存
GoodsAction.goodsFlashSaleStockLeft.listen(function (data) {
  goodsInterface.goodsFlashSaleStockLeft(data)
      .then(function (result) {
        this.completed(result);
      }.bind(this))
      .fail(function (msg) {
        this.failed(msg)
      }.bind(this))
});

//创建订单
GoodsAction.createGoodsOrder.listen(function (data) {
  goodsInterface.createGoodsOrder(data)
      .then(function (result) {
        this.completed(result);
      }.bind(this))
      .fail(function (msg) {
        this.failed(msg)
      }.bind(this))
});

export default GoodsAction;