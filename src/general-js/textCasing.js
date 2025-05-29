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