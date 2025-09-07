import { Translation } from '../../../../src/domain/value-objects/Translation';

export const validId = 1;
export const validResourceId = 131;
export const validText = 'In the name of Allah, the Beneficent, the Merciful.';
export const validLanguageCode = 'en';

export const expectTranslationToThrow = (
  id: number,
  resourceId: number,
  text: string,
  languageCode: string,
  expectedMessage: string
) => {
  const createTranslation = () => new Translation(id, resourceId, text, languageCode);
  expect(createTranslation).toThrow(expectedMessage);
};

export const testLanguageCodes = (codes: string[], expectedResult: boolean) => {
  codes.forEach((code) => {
    const translation = new Translation(validId, validResourceId, validText, code);
    expect(translation.isEnglish()).toBe(expectedResult);
  });
};
