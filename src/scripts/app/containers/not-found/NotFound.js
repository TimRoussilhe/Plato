import AbstractPageContainer from 'abstract/container.js';
import NotFound from 'components/not-found/NotFound';

class NotFoundContainer extends AbstractPageContainer {

	constructor(props){
		super(props);

		this.ComponentClass = NotFound;
	}

}

export default NotFoundContainer;
