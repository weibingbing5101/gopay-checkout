import React from 'react';
import ItemList from '../../components/ItemList/item-list';		// 组件
import ItemStore from '../../stores/item-store';				// M
import ItemActions from '../../actions/item-action';			// C

class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			loading: false
		};
	};
	componentDidMount() {		// 加载完成		时  监听函数
		this.unsubscribe = ItemStore.listen(this.onStatusChange.bind(this));
		ItemActions.loadItems();
	};

	componentWillUnmount() {	// 被删除前
		this.unsubscribe();
	};

	onStatusChange(state) {		// 双向数据
		this.setState(state);
	};
	render() {
		return (
			<div>
				<h1>Home Area</h1>
				<ItemList { ...this.state } />
			</div>
		)
	};
}

export default Home;