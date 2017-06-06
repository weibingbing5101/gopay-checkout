/**
 * Created by dell on 2016-1-29.
 */
import Reflux from 'reflux';

//数据请求模块
import { detailInterface } from '../modules/data-interface';

const DetailAction = Reflux.createActions(
  [
    {
      'getMerchantDetail':{children:['completed', 'failed']}
    },
    {
      'getMerchantIntroduction':{children:['completed', 'failed']}
    },
    {
      'getCouponDetail':{children:['completed', 'failed']}
    }
  ]
);

//门店详情
DetailAction.getMerchantDetail.listen(function (data) {
  detailInterface.merchantDetail(data)
  .then(function (result) {
      this.completed(result);
    }.bind(this))
  .fail(function (msg) {
      this.failed(msg)
    }.bind(this))
});

//门店图文详情
DetailAction.getMerchantIntroduction.listen(function (data) {
  detailInterface.merchantIntroduction(data)
  .then(function (result) {
      this.completed(result);
  }.bind(this))
  .fail(function (msg) {
      this.failed(msg)
  }.bind(this))
})

//券详情
DetailAction.getCouponDetail.listen(function (data) {

});

export default DetailAction;