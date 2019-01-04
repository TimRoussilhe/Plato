import AbstractContainer from 'abstract/container';
import {calculateResponsiveState} from 'redux-responsive';
import store from 'store';

// Components
import Layout from 'components/layout/Layout';

// Actions
import {setOrientation} from './actions';

class LayoutContainer extends AbstractContainer {

	constructor() {
		super();
		this.ComponentClass = Layout;
		// console.log('this.ComponentClass', this.ComponentClass);
		console.log('set componenet layout');

	}

	initActions() {
		this.props.actions.resize = () => this.resizeAction();
		this.props.actions.setOrientation = () => this.setOrientation();

	}

	resizeAction(wdw) {
		store.dispatch(calculateResponsiveState(wdw));
	}

	triggerResize() {
		this.component.triggerResize();
	}

	setMeta() {
		this.component.setMeta();
	}

	setOrientation(window){
		store.dispatch(setOrientation(window));
	}
}

export default LayoutContainer;
