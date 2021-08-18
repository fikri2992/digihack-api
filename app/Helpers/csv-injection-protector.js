'use strict'

module.exports = (str) => {
  try {
    const riskyChars = ["=", "+", "-", "@"];
    const firstChar = str.charAt(0);
    const isInjected = riskyChars.includes(firstChar);

    if(!isInjected) return str;

    return str.slice(1);
  } catch(error) {
    return str;
  }
}