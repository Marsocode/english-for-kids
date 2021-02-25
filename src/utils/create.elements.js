export default function createDOMElements({
  element,
  className,
  child,
  parent,
  ...dataAttr
} = {}) {
  let elementDOM = null;
  try {
    elementDOM = document.createElement(element);
  } catch (e) {
    const message = "Can't create HTMLelement. Give right name";
    throw new Error(e.stack, message);
  }

  if (className) {
    elementDOM.className = className;
  }

  if (child) {
    if (Array.isArray(child)) {
      child.forEach((childItem) => {
        if (childItem) elementDOM.append(childItem);
      });
    } else if (typeof child === 'object') {
      elementDOM.append(child);
    } else if (typeof child === 'string') {
      elementDOM.innerHTML = child;
    }
  }

  if (parent) {
    parent.appendChild(elementDOM);
  }

  if (dataAttr) {
    //  for example ([["id", "menu"], ["class", "menu-item"]])
    Object.values(dataAttr).forEach(([attrName, attrValue]) => {
      // if attrName comes without value (example - disabled), then:
      if (attrValue === '') {
        elementDOM.setAttribute(attrName, '');
      }

      if (attrName.match(/src|value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
        elementDOM.setAttribute(attrName, attrValue);
      } else {
        elementDOM.dataset[attrName] = attrValue;
      }
    });
  }

  return elementDOM;
}
