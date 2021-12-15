const merge = require("webpack-merge");
const common = require("./webpack.robots.common.js");
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports =  {
  entry: "./robots/src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env"]
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]"
        }
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../../public/modules/robots/"),
    publicPath: "/modules/robots/",
    filename: "robots.js"
  },
  plugins: [ new CleanWebpackPlugin()]
};
