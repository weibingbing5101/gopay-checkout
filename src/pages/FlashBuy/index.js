'use strict';
import React from 'react';
import store from 'store';
//import TimeAsix from 'ffan-time-slider';
//<TimeAsix sence={this.state.sence} onSelect={this.onTimeSelect.bind(this)}/>
import {CountDown} from './countDown';
import {Good} from './good';
import moment from 'moment';
import FlashbuyAction from '../../actions/flashbuy-action';
import InfiniteScroll from '../../components/InfiniteScroll';
import FlashbuyStroe from '../../stores/flashbuy-store';
import _ from 'underscore';

require('./ui.less');
class FlashBuy extends React.Component {
	constructor(props) {
		super(props);
		/**
		 * @sence 活动序列
		 * @goods 某活动下的商品列表
		 * @hasMore 是否还有更多活动，用于滚屏加载，目前不需要
		 * @countDown 活动倒计时，单位秒
		 * @sence_state 活动状态,0正在进行,1即将，2结束
		 */
		this.state={
			sence:[],   //页面上方的活动滑动内容
			goods:[],
			hasMore:false,
			countDown:0,
			sence_state:-1
		};

		this.adId='';
		this.currentSence=null; //当前显示的活动。即用户点击的
	}

	componentDidMount(){
		this.loadScr();
		this.loadGoods();
		store.set('cityId',this.props.params.cid);
		store.set('plazaId',this.props.params.pid);
		this.unsubscribe = FlashbuyStroe.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
        this.unsubscribe();
    }

    /**
     * @description 加载screeings
     * @return null
     */
	loadScr(){
		FlashbuyAction.getScr({data:{city:this.props.params.cid}});
	}

	/**
	 * @param  {商品id}
	 * @return 调用action,无返回
	 */
	loadGoods(id){
        if (id) {
          this.adId = id;
          FlashbuyAction.getGoods({adId:id});
        }
	}

	/**
	 * @description 滚屏加载更多，暂时用不到
	 * @return {[type]}
	 */
	onScollLoad(){

	}

	/**
	 * @description 当点击时间块时候触发
	 * @param  点击的活动
	 * @return 调用action
	 */
	onTimeSelect(sence){
		this.currentSence = sence;
		let s = 0;
		if(sence.state == 2){      //没开始的显示开始倒计时
			s = Math.floor((sence.startTime - moment())/1000);
		}else if(sence.state == 1){ //已经开始的显示结束倒计时
			s = Math.floor((sence.endTime - moment())/1000);
		}
		
		this.setState({
		    countDown:s,
			sence_state:sence.state
		});

		this.loadGoods(sence.sceneId);
	}

	/**
	 * @description 当store变化时候触发
	 * @param  store返回来的数据
	 * @return 无
	 */
	onStoreChanged(data){
        let that = this;
		let {goods, screenings} = data;
		if(screenings){
          let sence = [];
          let screening =  _.find(screenings, function(obj){return obj.plazaId == that.props.params.pid});
          if(screening) sence = screening.scene;
          if(!this.props.params.pid && screenings.length>0) sence = screenings[0].scene;

			//测试
			/*
			sence = [];
			sence.push({startTime: 1458712980000,endTime:1458713040000});
			*/
			
			this.setState({sence});

		}

		if(goods){
			this.setState({goods});
		}
	}

	onCountDownEnd(){
		setTimeout(()=>{
			let sence = this.state.sence; 
			this.setState({sence});
			this.onTimeSelect(this.currentSence);
		},1100);
		//window.location.reload();
		
	}

	render(){
		let items= this.state.goods.map(g=>
			<Good value={g} adId={this.adId} key={g.goodsSn} state={this.state.sence_state}/>
		);
		return (
			<div>
				<div className="fd_cd">
					<div style={{float:'left'}}>限时限量疯抢中！</div>
					<div className="" style={{float:'right'}}>
					    仅剩
						<CountDown seconds={this.state.countDown} onEnd={this.onCountDownEnd.bind(this)}/>
					</div>
					<div className="clear"></div>
				</div>

				<InfiniteScroll 
			  	hasMore={ this.state.hasMore }
			  	loadMore={ this.onScollLoad.bind(this) }
			  	className='fb-order-wrap'
			  	itemHeight='200'
			  >

				   { items }
			  </InfiniteScroll>
			</div>
			);
	}
}

FlashBuy.defaultProps = {
  title: "闪购"
};

export default FlashBuy;