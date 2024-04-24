const { minimatch } = require('minimatch')

module.exports = function match(str, patterns) {
  return patterns.some(p => minimatch(str, p))
}
