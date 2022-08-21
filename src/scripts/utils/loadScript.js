export function loadScript(src, done) {
  var js = document.createElement('script');
  js.src = src;
  js.onload = function () {
    done();
  };
  js.onerror = function () {
    done(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}

//https://philipwalton.com/articles/loading-polyfills-only-when-needed/
export const browserSupportsAllFeatures = () => {
  return window.fetch;
};
