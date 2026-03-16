export const navigateTo = (url: string): void => {
  window.location.href = url;
};

export const replaceLocation = (url: string): void => {
  window.location.replace(url);
};
