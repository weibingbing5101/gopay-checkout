/**
 * Created by wanghongguang on 16/3/10.
 * 用于商品详情页中的详情
 * 参数：detailText
 */

import React from 'react';

import $ from 'jquery';

require('./InfoDetail.less');


class DetailBox extends React.Component {

  htmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
  }


  render() {
    return (
        <div className="detail-box" style={{display:this.props.detailText!=''?'':'none'}} >
          <h2 className="goods-title" >商品详情</h2>
          <div className="goods-detail"  dangerouslySetInnerHTML={{__html: this.htmlDecode(this.props.detailText)}}></div>
        </div>
    );
  }
}

export default DetailBox;