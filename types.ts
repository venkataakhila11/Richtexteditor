export interface FontOption {
  value: string;
  label: string;
}

export enum GeminiActionType {
  REWRITE = 'REWRITE',
  SUMMARIZE = 'SUMMARIZE',
  EXPAND = 'EXPAND',
  FIX_GRAMMAR = 'FIX_GRAMMAR',
  MAKE_FORMAL = 'MAKE_FORMAL',
  MAKE_CASUAL = 'MAKE_CASUAL',
  CONTINUE_WRITING = 'CONTINUE_WRITING',
  EXTRACT_KEY_POINTS = 'EXTRACT_KEY_POINTS',
  EMOJIFY = 'EMOJIFY',
  SOFTEN_TONE = 'SOFTEN_TONE',
  CUSTOM_PROMPT = 'CUSTOM_PROMPT'
}

export interface AIState {
  isLoading: boolean;
  error: string | null;
  generatedContent: string | null;
}