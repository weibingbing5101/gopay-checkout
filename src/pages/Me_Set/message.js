import React from 'react';

import { findDOMNode } from 'react-dom';
import dateformat from 'dateformat';
import { Link } from 'react-router';

import CommonAction from '../../actions/common-action';
import UserAction from '../../actions/user-action';
import UserStore from '../../stores/user-store';

import InfiniteScroll from '../../components/InfiniteScroll';
import ScrollLoad from '../../components/ScrollLoad';

require('./message.less');

const PAGE_SIZE = 20;

class MyMessage extends React.Component{

  constructor(props){
    super(props);

    this.chooseAll = true;
    this.deleteMsgIndex = [];
    this.deleteMsgIds = [];
    this.msgListData = [];//unuse
    this.page = 1;
    this.state = {
      editable: false,
      msgList: [],
      hasMore: false
    }
  }

  componentDidMount() {
    //TODO: listenTo
    this.unsubscribe = UserStore.listen(this.onStoreChanged.bind(this));
    this.loadList();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  loadList(){
    UserAction.myMessageList({
      uid: UserStore.getUserInfo() ? UserStore.getUserInfo().uid : '',
      params: {
        userType: 0,
        limit: 20,
        offsetSet: this.page * PAGE_SIZE
      }
    })
  }

  onStoreChanged({data, error, loading}){
    if (loading != undefined) {
      CommonAction.loading(loading)
    }
    if (error) {
      CommonAction.alert(error)
    }
    if (data) {

      if(data.data){//listStoreChanged
        let msgList = [];
        data.data.forEach((item, index) => {
          msgList.push({
            newMsg: item.mailStatus == 0,
            text: item.content,
            time: item.createTime,
            id: item.mailInboxId
          })
        });

        let msgListData = this.msgListData;
        msgListData.push.apply(msgListData,msgList);

        this.setState({
          msgList: msgListData,
          hasMore: msgList.length >= PAGE_SIZE
        });
      }else {//deleteStoreChanged
        CommonAction.alert("删除成功")
      }


    }
  }

  initItem(){
    return(
      this.state.msgList.map( (item, index) => {
        let linkToDetail = '/me/myMessage/' + item.id ;
        let queryParams = {
          time: item.time,
          content: encodeURI(item.text)
        }
        return(
          <div className={ item.newMsg?'msg-list new':'msg-list' } key={ index }>
            <Link to={ linkToDetail } query={ queryParams }>
              <p className="msg">{ item.text }</p>
              <p className="m-font-grey">{ dateformat(item.time*1000,'yyyy-mm-dd hh:mm:ss') }</p>
            </Link>
            <span className="check" ref={ 'check_' + index } onClick={ this.chooseMsg.bind(this, index, item.id) }>

            </span>
          </div>
        )
      } )
    )
  }

  editMsg(){
    this.setState({
      editable: true
    })
  }

  chooseMsg(index, id){
    console.log(index)
    let dom = this.refs['check_'+index];
    if(dom.className == 'check'){
      this.refs['check_'+index].className = 'check checked';
      this.deleteMsgIndex.push(index);
      this.deleteMsgIds.push(id);
    }else {
      this.refs['check_'+index].className = 'check';
      this.deleteMsgIndex.splice(this.deleteMsgIndex.indexOf(index), 1)
      this.deleteMsgIds.splice(this.deleteMsgIds.indexOf(id), 1)
    }

  }

  chooseAllMsg(){
    let refs = this.refs;

    if(this.chooseAll){
      this.deleteMsgIndex = [];
      for(let key in refs){
        refs[key].className = 'check checked';
        this.deleteMsgIndex.push(parseInt(key.split('_')[1]))
      }
      this.chooseAll = false;
    }else {
      this.deleteMsgIndex = [];
      for(let key in refs){
        refs[key].className = 'check';
      }
      this.chooseAll = true;
    }

  }

  cancelEdit(){
    this.deleteMsgIndex.forEach((index) => {
      if(this.refs['check_'+index]){
        this.refs['check_'+index].className = 'check';
      }
    });
    this.setState({
      editable: false
    });
    this.deleteMsgIndex = [];
    this.deleteMsgIds = [];
  }

  deleteMsg(){
    console.log(this.deleteMsgIndex);
    console.log(this.deleteMsgIds);
    UserAction.deleteMessage({
      uid: UserStore.getUserInfo() ? UserStore.getUserInfo().uid : '',
      mailIds: '[' + this.deleteMsgIds + ']'
    });

    let msgList = this.state.msgList;
    //console.log(msgList)
    this.deleteMsgIndex.forEach((item, index) => {
      //msgList.splice(item, 1);
      delete msgList[item]
    });
    this.setState({
      msgList: msgList
    })
  }

  onScrollLoad(){
    this.page++;
    this.loadList();
  }

  render(){
    let item = this.initItem();
    let msgBoxClass = this.state.editable ? 'editable':'';
    return(
      <div className="my-message-list">
        <div className={ msgBoxClass }>
          <ScrollLoad
            className='msg-list-wrap'
            loadMore={ this.onScrollLoad.bind(this) }
            hasMore={ this.state.hasMore }
            itemHeight='96'
          >
            { item }
          </ScrollLoad>
        </div>
        <div className="edit-area">
          {(()=>{
            switch (this.state.editable){
              case true:
                return (
                  <p>
                    <span onClick={ this.chooseAllMsg.bind(this) }>全选</span>
                    <span onClick={ this.cancelEdit.bind(this) }>取消</span>
                    <span onClick={ this.deleteMsg.bind(this) }>删除</span>
                  </p>
                );
              default:
                return (
                  <p onClick={ this.editMsg.bind(this) }><span>编辑消息</span></p>
                )
            }
          })()}

        </div>
      </div>
    )
  }
}

MyMessage.defaultProps = { title: '我的消息' };

export default MyMessage;

/*
*
* <InfiniteScroll
 hasMore={ this.state.hasMore }
 loadMore={ this.onScrollLoad.bind(this) }
 className='msg-list-wrap'
 itemHeight='96'
 >
 { item }
 </InfiniteScroll>
* */