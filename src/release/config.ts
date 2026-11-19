// Only explicit build configuration may supply a public origin. Local builds omit it.
export const site = {
  origin: import.meta.env.VITE_SITE_ORIGIN || '',
  name: import.meta.env.VITE_SITE_NAME || '动效词典 Effect Lexicon',
  feedback: import.meta.env.VITE_FEEDBACK_URL || '',
  codeLicense: import.meta.env.VITE_CODE_LICENSE || '',
  codeLicenseUrl: import.meta.env.VITE_CODE_LICENSE_URL || '',
  contentTerms: import.meta.env.VITE_CONTENT_TERMS || '',
  assets: import.meta.env.VITE_RELEASE_ASSETS === 'true',
};
