const path = require("path");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // Giriş noktasını doğrudan mod.js yapıyoruz
  entry: path.resolve(__dirname, "src/mod.js"),
  mode: isProd ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "../dist/client/assets"),
    filename: "bundle.js" // Oyun bunu ana script olarak çağırıyor, böylece mod doğrudan ana dosya oluyor
  },
  plugins: [
    new DefinePlugin({
      VERSION: JSON.stringify(
        require("./package.json").version + (isProd ? "" : "-dev")
      )
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "public"),
        to: path.resolve(__dirname, "../dist/client")
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
