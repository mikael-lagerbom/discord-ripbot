const isInArray = (array, string) => {
  return array.indexOf(string.toLowerCase()) > -1;
};

module.exports = { isInArray };
