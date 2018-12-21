import AbstractPageContainer from 'abstract/container.js';
import NotFound from 'components/not-found/NotFound';

class NotFoundContainer extends AbstractPageContainer {

	constructor(options){
		super(options);

		this.ComponentClass = NotFound;
	}

}

export default NotFoundContainer;
