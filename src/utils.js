/**
 * Creates a valid url encoded queryString from the given object
 *
 * @param {object} params
 *
 * @return {string} the generated queryString
 */
const generateQueryString = (params) => {
  return new URLSearchParams(params).toString();
};

module.exports = { generateQueryString };
