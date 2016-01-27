// Convert Unix epoch time format to JavaScript date format
module.exports = function(time) {
  return new Date(0).setUTCSeconds(time);
};
