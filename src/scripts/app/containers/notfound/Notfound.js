import AbstractPageContainer from 'abstract/container.js';
import NotFound from 'components/notfound/Notfound';

class NotFoundContainer extends AbstractPageContainer {
	constructor(props) {
		super(props);

		this.ComponentClass = NotFound;
	}
}

export default NotFoundContainer;
