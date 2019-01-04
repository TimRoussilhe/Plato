import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/error.twig';

class NotFound extends AbstractPageComponent {

	constructor(props) {
		super(props);

		this.template = Tpl;
	}

}

export default NotFound;
