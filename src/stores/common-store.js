import Reflux from 'reflux';
import CommonActions from '../actions/common-action';

let CommonStore = Reflux.createStore({

	listenables: CommonActions,

	init() {
		this.alertText = '';
		this.loadingText = '';
		this.loadingShow = false;
		this.pageTitle = '果仁支付网';
	},

	alert(text, low) {
		this.alertText = text;
        this.alertLow = low;
		this.trigger(text, low);
	},

	loading(show, text){
		this.loadingShow = show;
		this.loadingText = text;
		this.trigger(show, text);
	},

	updateTitle(title){
		this.pageTitle = title;
		this.trigger(title);
	}
});

export default CommonStore;