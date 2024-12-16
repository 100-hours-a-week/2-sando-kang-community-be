const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  mode: "deveplopment", 
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: "main.cjs",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
  externalsPresets: {
    node: true,
  },
  externals: [nodeExternals()],
};
