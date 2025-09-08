import { createFinalizeHandler, FinalizeArgs } from './finalizeHandler';
import { createRangeRepeatHandler, RangeRepeatArgs } from './rangeRepeatHandler';
import { createSingleRepeatHandler } from './singleRepeatHandler';

export interface CompletionHandlers {
  single: () => boolean;
  range: () => boolean;
  surah: () => void;
  default: () => void;
}

interface CreateHandlersArgs extends RangeRepeatArgs, FinalizeArgs {
  handleSurahRepeat: () => void;
}

export function createCompletionHandlers(args: CreateHandlersArgs): CompletionHandlers {
  return {
    single: createSingleRepeatHandler(args),
    range: createRangeRepeatHandler(args),
    surah: args.handleSurahRepeat,
    default: createFinalizeHandler(args),
  };
}
