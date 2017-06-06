import React from 'react';

require('./message-detail.less');

import dateformat from 'dateformat';

import CommonAction from '../../actions/common-action';
import UserAction from '../../actions/user-action';
import UserStore from '../../stores/user-store';

class MessageDetail extends React.Component{

  constructor(props){
    super(props);
    //TODO:URL
    this.mailId = this.props.params.mailId;
    this.content = decodeURI(this.props.location.query.content);
    this.time = this.props.location.query.time;
  }

  componentDidMount() {
    this.unsubscribe = UserStore.listen(this.onStoreChanged.bind(this));
    this.loadDetail();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStoreChanged(info){
    //console.log(info)
  }

  loadDetail(){
    UserAction.readMessage({
      uid: UserStore.getUserInfo() ? UserStore.getUserInfo().uid : '',
      mailId: this.mailId,
      params:{
        mailStatus: 1
      }
    })
  }


  render(){
    return(
      <div className="my-message-detail">
        <div className="message-box">
          <p className="time">{ dateformat(this.time*1000,'yyyy-mm-dd hh:mm:ss') }</p>
          <p>
            { this.content }
          </p>
        </div>
      </div>
    )
  }
}

MessageDetail.defaultProps = { title: '消息详情' };

export default MessageDetail