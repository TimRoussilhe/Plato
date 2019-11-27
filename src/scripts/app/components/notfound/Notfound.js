import AbstractPageComponent from 'abstract/pageComponent';
import Tpl from 'templates/notfound.art';

class NotFound extends AbstractPageComponent {
	constructor(props) {
		super(props);

		this.template = Tpl;
	}
}

export default NotFound;
