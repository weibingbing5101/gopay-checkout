/**
 * Created by dell on 2016-1-29.
 */
import Reflux from 'reflux';

//��������ģ��
import { flashpayInterface } from '../modules/data-interface';

const FlashpayAction = Reflux.createActions(
  [
    {
      'checkUserBuy':{children:['completed', 'failed']}
    },
    {
      'flashpayList':{children:['completed','failed']}
    },
    {
      'getStoreFlashpay':{children:['completed','failed']}
    },
    {
      'getAllowUse':{children:['completed','failed']}
    }
  ]
);

//�ŵ�����-�ָ���
FlashpayAction.checkUserBuy.listen(function (data) {
  flashpayInterface.checkUserBuy(data)
    .then(function (result) {
      this.completed(result);
    }.bind(this))
    .fail(function (msg) {
      this.failed(msg)
    }.bind(this))
});

//�ָ����б�
FlashpayAction.flashpayList.listen(function (data) {
  flashpayInterface.flashpayList(data)
    .then(function (result) {
      this.completed(result)
     }.bind(this))
    .fail(function (msg) {
      this.failed(msg)
    }.bind(this))
});

//获取门店优惠规则
FlashpayAction.getStoreFlashpay.listen(function (data) {
  flashpayInterface.getStoreFlashpay(data)
  .then(function (result) {
    this.completed(result.data)
  }.bind(this))
  .fail(function (msg) {
    this.failed(msg)
  }.bind(this))
});

//获取门店规则是否可用
FlashpayAction.getAllowUse.listen(function (data) {
  flashpayInterface.getAllowUse(data)
    .then(function (result) {
      this.completed(result.data)
    }.bind(this))
    .fail(function (msg) {
      this.failed(msg)
    }.bind(this))
});

export default FlashpayAction;