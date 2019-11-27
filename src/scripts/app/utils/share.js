/* global window FB */
// import CV from 'config/currentValues';

class ShareUtil {
	constructor() {
		this.sizes = {
			facebook: [500, 600],
			twitter: [500, 310],
			google: [500, 425],
			pinterest: [750, 320],
		};

		this.urls = {
			facebook: 'https://www.facebook.com/sharer/sharer.php?u={{url}}',
			// twitter: 'https://twitter.com/intent/tweet?url={{url}}&text={{desc}}&hashtags={{hashtags}}&via={{via}}',
			twitter: 'https://twitter.com/intent/tweet?url={{url}}&text={{desc}}&hashtags={{hashtags}}',
			google: 'https://plus.google.com/share?url={{url}}',
			pinterest:
				'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{img}}&description={{title}},%20{{desc}}',
		};

		this.popup = null;
	}

	// ###########
	// # POPUP
	openPopup(el, debug = true) {
		const data = this.getShareDatas(el);
		let w;
		let h;

		if (debug) console.log('data', data);

		if (this.popup) {
			// if (this.detectIE() !== false && this.popup) {
			//     this.popup.close();
			// }
			this.popup.close();
			this.popup = null;
		}

		if (this.sizes[data.id]) {
			w = this.sizes[data.id][0];
			h = this.sizes[data.id][1];
		} else {
			w = 500;
			h = 400;
		}

		// if you use SDK
		if (data.id === 'facebook' && typeof FB !== 'undefined' && FB !== null) {
			const method = data.method ? data.method : 'feed';

			const params = {
				method,
				name: data.title,
				link: data.url,
				description: data.desc,
			};

			FB.ui(params, function(response) {
				const success = response && response.post_id;
			});

			return;
		}

		if (!this.urls[data.id]) return;

		let href = this.urls[data.id];
		href = href.replace('{{url}}', encodeURIComponent(data.url));
		href = href.replace('{{title}}', encodeURIComponent(data.title));
		href = href.replace('{{desc}}', encodeURIComponent(data.desc));
		href = href.replace('{{img}}', encodeURIComponent(data.img));
		href = href.replace('{{hashtags}}', encodeURIComponent(data.hashtags));
		href = href.replace('{{via}}', encodeURIComponent(data.via));

		if (debug) console.log('href', href);

		this.popup = window.open(
			href,
			data.id,
			`width=${w},height=${h},left=${this.getX(w)},top=${this.getY(
				h
			)},scrollbars=1,location=0,menubar=0,resizable=0,status=0,toolbar=0`
		);
		this.popup.focus();
	}

	/*
	 * Get share datas from DOM element
	 *
	 * @param {HTMLElement} el
	 * @example
	 * <a href=""
	 share-id="facebook|twitter|google|pinterest"
	 share-method
	 share-url
	 share-title
	 share-desc
     share-hashtags // TWITTER ONLY
     share-via // TWITTER ONLY
	 share-img></a>
	 */
	getShareDatas(el) {
		const obj = {
			desc: '',
			hashtags: '',
			via: '',
		};
		obj.id = el.getAttribute('share-id');

		if (el.getAttribute('share-method')) obj.method = el.getAttribute('share-method');

		// # url
		// here we setup share url to the currant page if you don't assign one
		// you can specify another one or setup an empty string ( twitter for example )
		if (el.getAttribute('share-url')) obj.url = el.getAttribute('share-url');
		else obj.url = window.location.href;

		// # title
		if (el.getAttribute('share-title')) obj.title = el.getAttribute('share-title');

		for (let i = 0; i < el.attributes.length; i++) {
			const attr = el.attributes[i];
			if (obj.title && !attr.name.match(/^data/)) obj.title = obj.title.replace(`{{${attr.name}}}`, attr.value);
		}

		// # desc
		// if (CV.share.twitter && obj.id === 'twitter') obj.desc = CV.share.twitter;

		if (el.getAttribute('share-desc')) obj.desc = el.getAttribute('share-desc');

		for (let j = 0; j < el.attributes.length; j++) {
			const attr = el.attributes[j];
			if (obj.desc && !attr.name.match(/^data/)) {
				obj.desc = obj.desc.replace(`{{${attr.name}}}`, attr.value);
			}
		}

		if (el.getAttribute('share-hashtags')) obj.hashtags = el.getAttribute('share-hashtags');
		if (el.getAttribute('share-via')) obj.via = el.getAttribute('share-via');

		// # img
		// obj.img = CV.share.img;
		if (el.getAttribute('share-img')) obj.img = el.getAttribute('share-img');

		// if (obj.img.substr(0, 4) !== 'http') obj.img = CV.baseUrl + obj.img;

		return obj;
	}

	getX(w) {
		const windowLeft = window.screenLeft ? window.screenLeft : window.screenX;
		return windowLeft + (window.outerWidth - w) * 0.5;
	}

	getY(h) {
		const windowTop = window.screenTop ? window.screenTop : window.screenY;
		return windowTop + (window.outerHeight - h) * 0.5;
	}

	/**
	 * detect IE
	 * returns version of IE or false, if browser is not Internet Explorer
	 */
	detectIE() {
		const ua = window.navigator.userAgent;

		const msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		const trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			const rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		const edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
}

export default new ShareUtil();
