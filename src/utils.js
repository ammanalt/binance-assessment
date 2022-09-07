const generateQueryString = (params) => {
  return new URLSearchParams(params).toString();
};

module.exports = { generateQueryString };
