/**
 * Created by dell on 2016-1-29.
 */
import Reflux from 'reflux';

//数据请求模块
import { commentInterface } from '../modules/data-interface';

const CommentAction = Reflux.createActions(
  [
    {
      'getMerchantScore':{children:['completed', 'failed']}
    }
  ]
);


//获取门店评分
CommentAction.getMerchantScore.listen(function (data) {
  commentInterface.getScore(data)
    .then(function (result) {
      this.completed(result);
    }.bind(this))
    .fail(function (msg) {
      this.failed(msg)
    }.bind(this))
});

export default CommentAction;