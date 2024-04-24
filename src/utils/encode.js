module.exports = function encode(str) {
  return new TextEncoder().encode(str)
}
