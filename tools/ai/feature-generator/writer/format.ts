export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const useCaseNames = (featureName: string): string[] => {
  const name = capitalize(featureName);
  return [`Get${name}`, `Create${name}`, `Update${name}`, `Delete${name}`];
};
