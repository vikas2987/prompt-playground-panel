
export const AVAILABLE_MODELS = {
  DEEPSEEK: 'deepseek-r1',
  LLAMA: 'us.meta.llama3-2-90b-instruct-v1:0'
} as const;

export type ModelName = typeof AVAILABLE_MODELS[keyof typeof AVAILABLE_MODELS];

export const DEFAULT_MODEL = AVAILABLE_MODELS.DEEPSEEK;
