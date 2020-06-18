module.exports = {
  handleTiming: function (latestStatus, statusCode, interval) {
    if (latestStatus != statusCode) {
        return 0;
    }
    return interval; //total minutes
  },
};
