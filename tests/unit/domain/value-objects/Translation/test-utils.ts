import { Translation } from '../../../../src/domain/value-objects/Translation';

export const validId = 1;
export const validResourceId = 131;
export const validText = 'In the name of Allah, the Beneficent, the Merciful.';
export const validLanguageCode = 'en';

export type ExpectTranslationParams = {
  id: number;
  resourceId: number;
  text: string;
  languageCode: string;
  expectedMessage: string;
};

export const expectTranslationToThrow = ({
  id,
  resourceId,
  text,
  languageCode,
  expectedMessage,
}: ExpectTranslationParams): void => {
  const createTranslation = (): Translation => new Translation(id, resourceId, text, languageCode);
  expect(createTranslation).toThrow(expectedMessage);
};

export const testLanguageCodes = (codes: string[], expectedResult: boolean): void => {
  codes.forEach((code) => {
    const translation = new Translation(validId, validResourceId, validText, code);
    expect(translation.isEnglish()).toBe(expectedResult);
  });
};
