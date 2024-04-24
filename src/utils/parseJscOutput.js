const path = require("path");
const match = require("./match.js");

const ROOT_DIR = process.cwd();

function flatArray(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatArray(val)) : acc.concat(val),
    []
  );
}

function parse(data, fileList, ignorePatterns, ctx) {
  const {
    program: { semanticDiagnosticsPerFile },
  } = data;

  const relativeFileList = fileList.map((f) => f.replace(ROOT_DIR, ".").toLowerCase());

  const ignoredFiles = new Set()

  return flatArray(semanticDiagnosticsPerFile).filter(
    (e) => {
      if (typeof e !== 'object') {
        return false
      }
      if (match(e.file, ignorePatterns)) {
        ctx.ignoredError++
        if (!ignoredFiles.has(e.file)) {
          ctx.ignoredFiles++
          ignoredFiles.add(e.file)
        }
      }
      return (
        relativeFileList.includes(e.file) &&
        !match(e.file, ignorePatterns)
      );
    }
  );
}

module.exports = parse;
