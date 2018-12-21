import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/error.twig';

class NotFound extends AbstractPageComponent {

	constructor(options) {
		super(options);

		this.template = Tpl;
	}

}

export default NotFound;
