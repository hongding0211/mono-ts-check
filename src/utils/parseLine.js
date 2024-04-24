function parseLine(buff, start, length) {
  let begin, end, lineNumber = 1, columnNumber = 0, whiteSpace = 0;
  let flag = false;
  for (let i = start; i >= 0; i--) {
    if (buff[i] === '\n') {
      flag = true;
      lineNumber++;
      if (begin === undefined) {
        begin = i;
      }
    }
    if (!flag) {
      columnNumber++;
    }
  }
  for (let i = start; i < buff.length && buff[i] !== '\n'; i++) {
    end = i;
  }
  const line = buff.slice(begin + 1, end + 1)
  for (let i = 0; i < line.length; i++, whiteSpace++) {
    if (line[i] !== ' ') {
      break;
    }
  }
  return {
    line: lineNumber,
    start: columnNumber - whiteSpace - 1,
    spaceOffset: whiteSpace,
    length,
    content: line.trim(),
  };
}

module.exports = parseLine;