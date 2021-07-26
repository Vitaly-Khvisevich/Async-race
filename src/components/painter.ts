export const createElement = (
  mainElement: HTMLElement,
  tag: string,
  elementClass: string,
  type = '',
  value = '',
  content = '',
  func = () => {}
): HTMLElement | HTMLInputElement => {
  const elem = document.createElement(tag) as HTMLInputElement;
  elem.className = elementClass;
  if (tag === 'button') {
    elem.textContent = content;
    elem.addEventListener('mousedown', func);
  }
  if (tag === 'input') {
    elem.type = type;
    elem.value = value;
  }
  mainElement.appendChild(elem);
  return elem;
};
