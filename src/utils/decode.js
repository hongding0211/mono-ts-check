module.exports = function decode(buff) {
  return new TextDecoder().decode(buff)
}
