export const cleanAiText = (text) => {
  if (!text) return "";

  return text
    .replace(/\*\*/g, "")        // remove **
    .replace(/`{1,3}/g, "")       // remove ` and ```
    .replace(/^#+\s?/gm, "")      // remove markdown headings
    .replace(/^\*\s?/gm, "")      // remove bullets
    .replace(/^-+\s?/gm, "")      // remove dashes
    .replace(/\n{3,}/g, "\n\n")   // reduce big gaps
    .trim();
};
