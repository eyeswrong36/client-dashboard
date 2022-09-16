export const slugify = (str, lowercase) => {
  // trim str
  str = str?.trim?.();
  if (!str) return '';

  if (lowercase) str = str.toLowerCase();

  return str
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Accepts a string and checks if the first word of the string
 * is a number or not. Removes the first word if it is a digit,
 * until it no longer have a digit as the first word.
 *
 * It is to make sure that document.querySelector doesn't get
 * any error because it doesn't allow the string to have a digit
 * as the first word.
 *
 * @param {string} str
 * @returns {string}
 */
export const sanitizeStrForSlug = (str) => {
  if (!str) return '';

  const slugs = Array.isArray(str) ? str : str.trim().split(' ');
  if (~slugs[0].search(/^\d/g)) {
    slugs.shift();
    sanitizeStrForSlug(slugs);
  }

  return slugs.join(' ');
};
