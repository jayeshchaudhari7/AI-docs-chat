const { getEncoding} =  require("js-tiktoken");

const encoding = getEncoding("cl100k_base");

const tokenize = (text) => {
  return encoding.encode(text);
};



const countTokens = (text) => {
  return encoding.encode(text).length;
};

const decodeTokens = (tokens) => {
  return encoding.decode(tokens);
};

module.exports = { tokenize,countTokens,decodeTokens}