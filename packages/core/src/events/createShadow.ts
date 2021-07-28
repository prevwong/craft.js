export const createShadow = (e: DragEvent, targetDOM: HTMLElement) => {
  const selectorDOM = e.currentTarget as HTMLElement;
  const { top, left, width, height } = targetDOM.getBoundingClientRect();

  if (!selectorDOM) {
    return;
  }

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-100%';
  container.style.top = `-100%`;
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';

  const shadow = targetDOM.cloneNode(true) as HTMLElement;
  shadow.style.position = `absolute`;
  shadow.style.width = `${width}px`;
  shadow.style.height = `${height}px`;
  shadow.style.left = `${left}px`;
  shadow.style.top = `${top}px`;

  container.appendChild(shadow);

  document.body.appendChild(container);
  e.dataTransfer.setDragImage(container, left, top);

  return container;
};
