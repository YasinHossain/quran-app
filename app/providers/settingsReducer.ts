import { Settings } from '@/types';

export type Action =
  | { type: 'SET_SETTINGS'; value: Settings }
  | { type: 'SET_SHOW_BY_WORDS'; value: boolean }
  | { type: 'SET_TAJWEED'; value: boolean }
  | { type: 'SET_WORD_LANG'; value: string }
  | { type: 'SET_WORD_TRANSLATION_ID'; value: number }
  | { type: 'SET_TAFSIR_IDS'; value: number[] }
  | { type: 'SET_TRANSLATION_IDS'; value: number[] }
  | { type: 'SET_ARABIC_FONT_SIZE'; value: number }
  | { type: 'SET_TRANSLATION_FONT_SIZE'; value: number }
  | { type: 'SET_TAFSIR_FONT_SIZE'; value: number }
  | { type: 'SET_ARABIC_FONT_FACE'; value: string };
type HandlerMap = {
  [K in Action['type']]: (state: Settings, action: Extract<Action, { type: K }>) => Settings;
};

const handlers: HandlerMap = {
  SET_SETTINGS: (_state, action) => action.value,
  SET_SHOW_BY_WORDS: (state, action) => ({ ...state, showByWords: action.value }),
  SET_TAJWEED: (state, action) => ({ ...state, tajweed: action.value }),
  SET_WORD_LANG: (state, action) => ({ ...state, wordLang: action.value }),
  SET_WORD_TRANSLATION_ID: (state, action) => ({
    ...state,
    wordTranslationId: action.value,
  }),
  SET_TAFSIR_IDS: (state, action) => ({ ...state, tafsirIds: action.value }),
  SET_TRANSLATION_IDS: (state, action) => ({
    ...state,
    translationIds: action.value,
    translationId: action.value.length > 0 ? action.value[0] : state.translationId,
  }),
  SET_ARABIC_FONT_SIZE: (state, action) => ({ ...state, arabicFontSize: action.value }),
  SET_TRANSLATION_FONT_SIZE: (state, action) => ({
    ...state,
    translationFontSize: action.value,
  }),
  SET_TAFSIR_FONT_SIZE: (state, action) => ({ ...state, tafsirFontSize: action.value }),
  SET_ARABIC_FONT_FACE: (state, action) => ({ ...state, arabicFontFace: action.value }),
};

export const reducer = (state: Settings, action: Action): Settings => {
  const handler = handlers[action.type] as
    | ((state: Settings, action: Action) => Settings)
    | undefined;
  return handler ? handler(state, action) : state;
};
