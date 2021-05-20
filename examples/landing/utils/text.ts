export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.substr(1, text.length);
export const weightDescription = (weight: number) =>
  weight === 400 ? 'Regular' : weight === 500 ? 'Medium' : 'Bold';
