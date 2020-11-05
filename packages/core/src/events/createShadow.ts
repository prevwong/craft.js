export const createShadow = (
  e: DragEvent,
  targetDOM: HTMLElement,
  shadowsToCreate: HTMLElement[]
) => {
  const selectorDOM = e.currentTarget as HTMLElement;
  const {
    top: targetTop,
    left: targetLeft,
  } = targetDOM.getBoundingClientRect();

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

  shadowsToCreate.forEach((dom) => {
    const shadow = dom.cloneNode(true) as HTMLElement;
    const { width, height, top, left } = dom.getBoundingClientRect();
    shadow.style.position = `absolute`;
    shadow.style.width = `${width}px`;
    shadow.style.height = `${height}px`;
    shadow.style.left = `${left}px`;
    shadow.style.top = `${top}px`;

    container.appendChild(shadow);
  });

  document.body.appendChild(container);
  e.dataTransfer.setDragImage(container, targetLeft, targetTop);

  return container;
};
