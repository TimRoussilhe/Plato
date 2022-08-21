// import picturefill from 'picturefill';
// picturefill();

// const img = document.createElement('img');
// const isWSupported = 'sizes' in img;
const isPictureSupported = !!window.HTMLPictureElement;

// TODO: add error handlers
// TODO: add is-loading
// TODO: explore lazy with intersection observer

const isImageValid = ($image) => {
  if (isPicture($image)) {
    return isPictureValid($image);
  }

  return isImgValid($image);
};

const isImgValid = ($image) => {
  const nodeName = $image.nodeName.toLowerCase();
  return (
    ($image.hasAttribute('data-src') || $image.hasAttribute('data-srcset')) &&
    (nodeName === 'img' || nodeName === 'source')
  );
};

const isPictureValid = ($image) => {
  const parent = $image.parentNode;

  let isSourcesValid = true;
  const sourceTags = getSourceTags(parent);
  sourceTags.forEach((sourceTag) => {
    if (!isImgValid(sourceTag)) isSourcesValid = false;
  });

  return isSourcesValid;
};

const isPicture = ($image) => {
  const parent = $image.parentNode;
  return parent && parent.tagName === 'PICTURE';
};

const getSourceTags = (parentTag) => {
  let sourceTags = [];

  let childTag;
  for (let i = 0; (childTag = parentTag.children[i]); i += 1) {
    if (childTag.tagName === 'SOURCE') {
      sourceTags.push(childTag);
    }
  }

  return sourceTags;
};

export const loadImage = ($image) => {
  return new Promise((resolve) => {
    const onLoad = (event) => {
      // If the image is setting a background image, add loaded class to parent.
      // ImageLoader won't reset background image if the 'src' exists, so remove after load.
      // this will only works with data-src
      if ($image.hasAttribute('data-use-bg-image')) {
        $image.parentNode.classList.add('is-loaded');
        $image.removeAttribute('src');
        $image.style.display = 'none';
      } else {
        $image.classList.add('is-loaded');
      }

      // remove load event listener to prevent duplicates
      $image.removeEventListener('load', onLoad);
      resolve($image);
    };

    $image.addEventListener('load', onLoad);

    if (isPicture($image)) {
      const sourceTags = getSourceTags($image.parentNode);
      sourceTags.forEach((sourceTag) => {
        setImageAttributes(sourceTag);
      });

      // load fallback if not supported
      // we added this because otherwise fallback will be loaded with the source
      if (!isPictureSupported) {
        setImageAttributes($image);
      }
    } else {
      setImageAttributes($image);
    }
  });
};

const setImageAttributes = ($image) => {
  if ($image.hasAttribute('data-sizes')) {
    if (!$image.hasAttribute('sizes')) {
      $image.setAttribute('sizes', $image.dataset.sizes);
    }
  }

  if ($image.hasAttribute('data-srcset')) {
    $image.setAttribute('srcset', $image.dataset.srcset);
  }

  if ($image.hasAttribute('data-src')) {
    $image.setAttribute('src', $image.dataset.src);
  }
};

/**
 * Image load one or more images using Promise.all.
 * @param {DOMElement[]} $images An array of images to load.
 * @param {function} afterImageLoad A function to be called after every image load
 * @return {Promise} Promise that resolves when all images are loaded
 */
export const loadImages = ($images, afterImageLoad) => {
  if (!Array.isArray($images)) {
    console.warn('Load images promise should take an array of images, instead got type', typeof $images);
    return;
  }

  if (Array.isArray($images) && $images.length === 0) {
    console.warn('Empty Array', typeof $images);
    return;
  }

  const imagePromises = $images.map(($image) => {
    if (!$image) return false;

    return new Promise((resolve) => {
      // check if image is image and has proper attributes
      if (!isImageValid($image)) {
        console.warn('ImageLoader: Missing proper attribute data-*');
        resolve($image);
        return;
      }

      loadImage($image).then(($image) => {
        typeof afterImageLoad === 'function' && afterImageLoad($image);
        resolve($image);
      });
    });
  });

  return Promise.all(imagePromises);
};

export default loadImages;
