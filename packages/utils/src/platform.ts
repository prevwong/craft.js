export const isClientSide = () => typeof window !== 'undefined';

export const isLinux = () =>
  isClientSide() && /Linux/i.test(window.navigator.userAgent);

export const isChromium = () =>
  isClientSide() && /Chrome/i.test(window.navigator.userAgent);
