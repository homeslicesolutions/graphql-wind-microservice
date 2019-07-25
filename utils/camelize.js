module.exports = function camelize(text) {
  return text
    .split('_')
    .map((t, index) => {
      if (!index) return t; // skip first one
      return `${t.substring(0, 1).toUpperCase()}${t.substring(1)}`;
    })
    .join('');
}
