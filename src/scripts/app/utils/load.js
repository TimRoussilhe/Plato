import { VIDEO_TYPE, IMAGE_TYPE, FILE_TYPE } from 'constants/misc';

export const loadJSON = (url, options = {}) => {
	return fetch(url, options)
		.then(response => {
			// console.log('response:url', url, response);
			return response.json();
		})
		.catch(err => {
			console.error('load()::Json error', err, url);
			return false;
		})
		.then(data => {
			if (!data) {
				console.info('data are empty', url);
				return false;
			}

			if (options.delay) {
				setTimeout(() => {
					return data;
				}, options.delay);
			}

			return data;
		})
		.catch(err => {
			console.error('load()::Data error', err, url);
			return false;
		});
};

export const loadImg = (url, options = {}) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		let xhr = null;

		// console.log('loadImg', url);

		// const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
		const useXHR = false;

		// Trigger the loading with a XHR request
		if (useXHR && window.URL && window.Blob && window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'arraybuffer';

			xhr.onerror = e => {
				xhr.abort();
				xhr = null;

				// load old fashion way
				if (img.complete && img.height) {
					resolve(img);
				} else {
					img.addEventListener('load', () => {
						resolve(img);
					});
					img.addEventListener('onerror', err => {
						reject(err);
					});

					img.src = url;
				}
			};

			xhr.onload = e => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						let extension = url.split('.').pop();
						extension = extension.split('?')[0].toLowerCase();

						if (options.extension) extension = options.extension;

						// Obtain a blob: URL for the image data.
						const arrayBufferView = new window.Uint8Array(xhr.response);
						const blob = new Blob([arrayBufferView], { type: 'image/' + extension });
						const imageUrl = URL.createObjectURL(blob);

						// load from the cache as the blob is here already
						img.addEventListener('load', () => {
							resolve(img);
						});
						img.addEventListener('onerror', err => {
							reject(err);
						});

						img.src = imageUrl;
					} else {
						xhr.abort();
						xhr = null;

						// something went wrong..
						img.addEventListener('load', () => {
							resolve(img);
						});
						img.addEventListener('onerror', err => {
							reject(err);
						});

						img.src = url;
					}
				}
			};

			xhr.send();
		} else if (img.complete && img.height) {
			resolve(img);
		} else {
			img.addEventListener('load', () => {
				console.log('img laoded!', url);
				resolve(img);
			});
			img.addEventListener('onerror', err => {
				reject(err);
			});

			img.src = url;
		}
	});
};

export const loadVideo = (url, options = { autoplay: true, muted: true, loop: true, controls: false }) => {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video');

		// console.log('loadVideo', url);

		video.autoplay = options.autoplay;
		video.muted = options.muted;
		video.loop = options.loop;
		video.controls = options.controls;

		video.src = url;

		const isSafari = false; // /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

		if (video.readyState > 3) {
			resolve(video);
			return;
		}

		// nope...
		if (isSafari) {
			resolve(video);
		} else {
			video.oncanplaythrough = () => {
				console.log('video loaded!', url);
				video.pause();
				video.currentTime = 0;
				video.oncanplaythrough = null;
				resolve(video);
			};

			video.load();
			video.play();
		}
	});
};

export const loadAsset = (asset_, options = {}) => {
	const asset = typeof asset_ === 'string' ? { src: asset_ } : asset_;

	// add type
	if (asset.extension) options.extension = asset.extension;

	switch (asset.type) {
		case VIDEO_TYPE:
			return loadVideo(asset.src, options);
		case IMAGE_TYPE:
			return loadImg(asset.src, options);
		case FILE_TYPE:
			return loadJSON(asset.src, options);
		default:
			return loadJSON(asset.src, options);
	}
};
