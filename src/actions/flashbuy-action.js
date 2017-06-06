import Reflux from 'reflux';


import { flashbuyInterface } from '../modules/data-interface';

export const FlashbuyAction = Reflux.createActions(
  [
    {
      'getScr':{children:['completed', 'failed']}
    },
    {
      'getGoods':{children:['completed','failed']}
    }
  ]
);


FlashbuyAction.getScr.listen(function (data) {
  flashbuyInterface.getScreenings(data)
    .then(r => {this.completed(r)})
    .fail(m => this.failed(m));
});


FlashbuyAction.getGoods.listen(function (data) {
  flashbuyInterface.getGoods(data)
 .then(r => this.completed(r))
 .fail(m => this.failed(m));
});


export default FlashbuyAction;