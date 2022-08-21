import Cache from 'app/Cache.js';
import { getPath, clean } from 'utils/url.js';
import { getRouteByURL } from 'app/selectors.js';
import { Prevent } from './Prevent.js';
import { JSON_ENDPOINTS } from 'constants/config.js';

export class Prefetch {
  constructor() {
    this.prevent = new Prevent();
  }

  /**
   * Bind Prefetch event listeners.
   */
  bindPrefetch() {
    this.onLinkEnterHandler = this.onLinkEnter.bind(this);
    const links = document.querySelectorAll('a');
    this._links = [...links];
    this._links.forEach((link) => {
      link.addEventListener('mouseenter', this.onLinkEnterHandler);
    });
  }

  /**
   * Unbind Prefetch event listeners.
   */
  unbindPrefetch() {
    this._links.forEach((link) => {
      link.removeEventListener('mouseenter', this.onLinkEnterHandler);
    });
  }

  /**
   * Reset Prefetch event listeners.
   */
  resetPrefetch() {
    this.unbindPrefetch();
    this.bindPrefetch();
  }

  /**
   * When a element is entered.
   */
  onLinkEnter(e) {
    const link = this._getLinkElement(e);
    if (!link) {
      return;
    }

    const href = this.getHref(link);
    // Already in cache
    if (Cache.has(href)) {
      return;
    }
    let path = getPath(clean(href));
    if (path === '') path = '/';

    if (!path) {
      return;
    }

    const route = getRouteByURL(path);

    if (!route || !route.json) {
      return;
    }

    this.prefetch(route.id, JSON_ENDPOINTS + route.json);
  }

  /**
   * Get a valid link ancestor.
   *
   * Check for a "href" attribute.
   * Then check if eligible.
   */
  _getLinkElement(e) {
    let el = e.target;

    while (el && !this.getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (!el || this.prevent.checkLink(el, e, this.getHref(el))) {
      return;
    }

    return el;
  }

  /**
   * Get URL from `href` value.
   */
  getHref(el) {
    // HTML tagName is UPPERCASE, xhtml tagName keeps existing case.
    if (el.tagName && el.tagName.toLowerCase() === 'a') {
      // HTMLAnchorElement, full URL available
      if (typeof el.href === 'string') {
        return el.href;
      }
    }
    return null;
  }

  /**
   * Prefetch a page.
   */
  prefetch(href, JSONUrl) {
    // Already in cache
    if (Cache.has(href)) {
      return;
    }
    Cache.set(
      href,
      this.request(JSONUrl)
        .then((data) => {
          Cache.set(href, data);
        })
        .catch((error) => {
          console.error(error);
        })
    );
  }

  /**
   * Init a page request.
   * Fetch the page and returns a promise with the text content.
   */
  request(url) {
    return new Promise(async (resolve, reject) => {
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          resolve(json);
        })
        .catch((ex) => {
          reject(ex);
        });
    });
  }
}
