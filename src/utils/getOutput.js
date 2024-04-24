const chalk = require('chalk');

function getOutput(msg, meta) {
  const { line, start, spaceOffset, length, content } = meta;
  const msgText = typeof msg === 'object' ? msg.messageText : msg;
  return (
    chalk.gray(`  ${line}:${start + spaceOffset}`) +
    chalk.red(`  error  `) +
    content.slice(0, start) +
    chalk.red.underline(content.slice(start, start + length)) +
    content.slice(start + length) +
    "\r\n  " +
    JSON.stringify(msgText)
  );
}

module.exports = getOutput;