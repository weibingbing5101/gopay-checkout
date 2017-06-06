import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';
import Button from '../../components/Form/button';
import { priceFilter } from '../../modules/tools';

export class Good extends React.Component{
	constructor(props) {
		super(props);
		this.inter;
		this.state={
		
		};
	}


	renderBtn(g){
		let btn = '';
		if(this.props.state === 0){
			btn = <Button type="disable" className="btn-radius">已经结束</Button>;
		}else if(this.props.state == 1){
			 btn = <Link to={`/goods/${g.id}/${this.props.adId}`} className="button btn-red btn-radius">立即抢购</Link>
		}else if(this.props.state == 2){
			 btn = <Button type="disable" className="btn-radius">即将开始</Button>;
		}
		return btn;
	}

	render(){
		let g= this.props.value;

		return(
			<div className="fb_good" key={g.goodsSn}>
				<div className="w_40">
					<Link to={`/goods/${g.id}/${this.props.adId}`}><img src={`http://img1.ffan.com/norm_320/${g.goodsPic}`}/></Link>
				</div>
				<div className="w_60">
					<div className="h_50">
						<Link to={`/goods/${g.id}/${this.props.adId}`}><h3>{g.goodsName}</h3></Link>
						<p style={{color:'#898989'}}>剩余{g.stockNum}件</p>
					</div>
					<div className="h_50" style={{display:'flex','paddingTop':'30px'}}>
						<div className="w_50 inline-block">
							<span className="sb_finalPrice">￥{priceFilter(g.finalPrice)}</span>
							<s className="sb_oriPrice">￥{priceFilter(g.oriPrice)}</s>
						</div><div className="w_50 inline-block">
							{this.renderBtn(g)}
						</div>
					</div>
				</div>
			</div>
			);
	}
}