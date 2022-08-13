import Page from 'abstract/page.js';
import Tpl from 'templates/notfound.art';

class NotFound extends Page {
	constructor(props) {
		super(props);

		this.template = Tpl;
	}
}

export default NotFound;
