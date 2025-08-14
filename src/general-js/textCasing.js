export function toSentenceCase(str) {
  return str.replace(/[a-z]/i, function(letter) {
    return letter.toUpperCase();
  }).trim();
}

export function toTitleCase(str) {
  return toSentenceCase(str).replace(
    /[A-Z]/g,
    text => ' ' + text
  ).trim();
}

export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // handle camelCase
    .replace(/\s+/g, '-')                // replace spaces with -
    .replace(/_+/g, '-')                 // replace underscores with -
    .replace(/&/g, '')                   // remove &
    .toLowerCase()
    .replace(/--+/g, '-')                // replace multiple - with single -
    .replace(/^-+|-+$/g, '');            // trim leading/trailing -
}