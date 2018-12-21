import AbstractContainer from 'abstract/container';
import Header from 'components/header/Header';

// import {getRoute} from 'containers/app/selectors';

class HeaderContainer extends AbstractContainer {

	constructor(options) {
		super(options);
		this.ComponentClass = Header;

	}

}

export default HeaderContainer;
