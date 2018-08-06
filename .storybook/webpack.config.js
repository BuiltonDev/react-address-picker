const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loaders: ["babel-loader"],
        include: path.resolve(__dirname, "../")
      }
    ]
  }
};
