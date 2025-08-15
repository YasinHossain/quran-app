import { Settings } from '@/types';

export type Action =
  | { type: 'SET_SETTINGS'; value: Settings }
  | { type: 'SET_SHOW_BY_WORDS'; value: boolean }
  | { type: 'SET_TAJWEED'; value: boolean }
  | { type: 'SET_WORD_LANG'; value: string }
  | { type: 'SET_WORD_TRANSLATION_ID'; value: number }
  | { type: 'SET_TAFSIR_IDS'; value: number[] }
  | { type: 'SET_TRANSLATION_IDS'; value: number[] };

export const reducer = (state: Settings, action: Action): Settings => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return action.value;
    case 'SET_SHOW_BY_WORDS':
      return { ...state, showByWords: action.value };
    case 'SET_TAJWEED':
      return { ...state, tajweed: action.value };
    case 'SET_WORD_LANG':
      return { ...state, wordLang: action.value };
    case 'SET_WORD_TRANSLATION_ID':
      return { ...state, wordTranslationId: action.value };
    case 'SET_TAFSIR_IDS':
      return { ...state, tafsirIds: action.value };
    case 'SET_TRANSLATION_IDS':
      return {
        ...state,
        translationIds: action.value,
        translationId: action.value.length > 0 ? action.value[0] : state.translationId,
      };
    default:
      return state;
  }
};
