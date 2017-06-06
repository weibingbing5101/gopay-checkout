import Reflux from 'reflux';
import ItemActions from '../actions/item-action';

// M层    数据池
let ItemStore = Reflux.createStore({
	listenables: ItemActions,

	init() {
		this.items = [];
	},
	// 加载中
	loadItems() {
		this.trigger({
			loading: true
		});
	},
	//	加载成功
	loadItemsCompleted(items) {
		this.items = items;

		this.trigger({										//* 当Store调用trigger时，才会执行onStatusChange函数
			items: this.items,
			loading: false
		});
	},
	// 加载失败
	loadItemsFailed(error) {
		this.trigger({
			error: error,
			loading: false
		});
	}
});

export default ItemStore;