// TODO: this approach does not work with Safari
// Works partially with Linux (except on Chrome)
// We'll need an alternate way to create drag shadows
export const createShadow = (
  e: DragEvent,
  shadowsToCreate: HTMLElement[],
  forceSingleShadow: boolean = false
) => {
  if (shadowsToCreate.length === 1 || forceSingleShadow) {
    const { width, height } = shadowsToCreate[0].getBoundingClientRect();
    const shadow = shadowsToCreate[0].cloneNode(true) as HTMLElement;

    shadow.style.position = `fixed`;
    shadow.style.left = `-100%`;
    shadow.style.top = `-100%`;
    shadow.style.width = `${width}px`;
    shadow.style.height = `${height}px`;
    shadow.style.pointerEvents = 'none';

    document.body.appendChild(shadow);
    e.dataTransfer.setDragImage(shadow, 0, 0);

    return shadow;
  }

  /**
   * If there's supposed to be multiple drag shadows, we will create a single container div to store them
   * That container will be used as the drag shadow for the current drag event
   */
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-100%';
  container.style.top = `-100%`;
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';

  shadowsToCreate.forEach((dom) => {
    const { width, height, top, left } = dom.getBoundingClientRect();
    const shadow = dom.cloneNode(true) as HTMLElement;

    shadow.style.position = `absolute`;
    shadow.style.left = `${left}px`;
    shadow.style.top = `${top}px`;
    shadow.style.width = `${width}px`;
    shadow.style.height = `${height}px`;

    container.appendChild(shadow);
  });

  document.body.appendChild(container);
  e.dataTransfer.setDragImage(container, e.clientX, e.clientY);

  return container;
};
