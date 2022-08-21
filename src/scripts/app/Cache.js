/**
 * Cache for storing URL / DATA.
 */

class Cache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set value to cache
   */
  set(href, data) {
    this.cache.set(href, {
      data,
    });
    return {
      data,
    };
  }

  /**
   * Get data from cache
   */
  get(href) {
    return this.cache.get(href);
  }

  /**
   * Get data from cache
   */
  getData(href) {
    return this.cache.get(href).data;
  }

  /**
   * Check if value exists into cache
   */
  has(href) {
    console.log('href', href);
    return this.cache.has(href);
  }

  /**
   * Delete value from cache
   */
  delete(href) {
    return this.cache.delete(href);
  }

  /**
   * Update cache value
   */
  update(href, data) {
    const state = {
      ...this.cache.get(href),
      ...data,
    };
    this.cache.set(href, state);

    return state;
  }
}

const cache = new Cache();
export default cache;
