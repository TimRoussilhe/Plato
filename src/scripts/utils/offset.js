/* global  document window */

const body = document.body;

function getOffset(element) {
  let bodyRect = body.getBoundingClientRect(),
    elemRect = element.getBoundingClientRect(),
    offset = elemRect.top - bodyRect.top;

  return offset;
}

function getDocumentHeight() {
  let html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

function getPositionStart(element, viewFactor = 0, wHeight = window.innerHeight) {
  const offset = getOffset(element);
  const elementHeight = element.offsetHeight;
  const windowHeight = wHeight;

  const positionTop = offset - windowHeight + elementHeight * viewFactor;
  return positionTop > 0 ? positionTop : 0;
}

function getPositionEnd(element, viewFactor = 0, wHeight = window.innerHeight) {
  let offset = getOffset(element);
  let elementHeight = element.offsetHeight;
  const documentHeight = getDocumentHeight();
  let positionBottom = offset + elementHeight - elementHeight * viewFactor;

  return positionBottom > documentHeight - wHeight ? documentHeight - wHeight : positionBottom;
}

// pass an array of DOM elements
// get a array back on the one currently in the viewport
// TODO: add param to control if entirely visible
function getElementsInViewport(elements) {
  // we check the current elements
  // we pass this here to avoid multiple calls ( not sure if usefull might be worth measure )
  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  let elementInViewportElements = [];
  // const elements = [...this.tiles, ...this.sectionHeader];

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    const inViewport = elementInViewport(element, pageXOffset, pageYOffset, innerWidth, innerHeight);
    if (inViewport) {
      // element.style.transition = 'none';
      elementInViewportElements.push(element);
    }
  }

  return elementInViewportElements;
}

function elementInViewport(
  el,
  pageXOffset = window.pageXOffset,
  pageYOffset = window.pageYOffset,
  innerWidth = window.innerWidth,
  innerHeight = window.innerHeight
) {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < pageYOffset + innerHeight &&
    left < pageXOffset + innerWidth &&
    top + height > pageYOffset &&
    left + width > pageXOffset
  );
}

module.exports = { getOffset, getPositionStart, getPositionEnd, getDocumentHeight, getElementsInViewport };
