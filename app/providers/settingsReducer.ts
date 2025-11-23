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
  | { type: 'SET_ARABIC_FONT_FACE'; value: string }
  | { type: 'SET_MUSHAF_ID'; value: string };

type ActionHandlerMap = {
  [Type in Action['type']]: (state: Settings, action: Extract<Action, { type: Type }>) => Settings;
};

const actionHandlers = {
  SET_SETTINGS: (_state, action) => action.value,
  SET_SHOW_BY_WORDS: (state, action) => ({ ...state, showByWords: action.value }),
  SET_TAJWEED: (state, action) => ({ ...state, tajweed: action.value }),
  SET_WORD_LANG: (state, action) => ({ ...state, wordLang: action.value }),
  SET_WORD_TRANSLATION_ID: (state, action) => ({ ...state, wordTranslationId: action.value }),
  SET_TAFSIR_IDS: (state, action) => ({ ...state, tafsirIds: action.value }),
  SET_TRANSLATION_IDS: (state, action) => {
    const [primaryTranslationId] = action.value;

    return {
      ...state,
      translationIds: action.value,
      translationId: primaryTranslationId ?? state.translationId,
    };
  },
  SET_ARABIC_FONT_SIZE: (state, action) => ({ ...state, arabicFontSize: action.value }),
  SET_TRANSLATION_FONT_SIZE: (state, action) => ({ ...state, translationFontSize: action.value }),
  SET_TAFSIR_FONT_SIZE: (state, action) => ({ ...state, tafsirFontSize: action.value }),
  SET_ARABIC_FONT_FACE: (state, action) => ({ ...state, arabicFontFace: action.value }),
  SET_MUSHAF_ID: (state, action) => ({ ...state, mushafId: action.value }),
} satisfies ActionHandlerMap;

export const reducer = (state: Settings, action: Action): Settings =>
  // actionHandlers is exhaustive, so this cast is safe for the selected handler.
  actionHandlers[action.type](state, action as never);
