import Reflux from 'reflux';	// Reflux是根据React的flux创建的单向数据流类库。

// C层		控制器
const ItemActions = Reflux.createActions({
	'loadItems': {children: ['completed', 'failed']}		//* 有两个事件  completed  filed  
});

ItemActions.loadItems.listen(function(){					//* 
	// make your api call/ async stuff here
	// we use setTimeout for faking async behaviour here
	setTimeout(() => {
		const items = ['Foo', 'Bar', 'Lorem'];
		this.completed(items);

		// on error
		// this.failed('an error occured');
	}, 500);
});

export default ItemActions;