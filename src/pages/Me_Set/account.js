
/**
 * @file 账号管理
 */

'use strict';

import React from 'react';

import Header from '../../components/Header/header';
import { ItemList } from '../../components/wx_ItemList';


class Account extends React.Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
        <div className="item-section m-bg-grey">
          <ItemList data = { this.props.itemList }  />
        </div>
    );
  }

}

Account.defaultProps = {
  title: '账号管理',
  itemList: [
    {
      icon: '',
      link: '/me/account/pwd',
      content: '登录密码管理',
      iconNext: true,
      sideContent: '',
      otherStyle: ''
    }
  ]
};

export default Account;
