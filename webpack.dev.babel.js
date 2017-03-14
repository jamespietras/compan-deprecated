import fs from 'fs';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import WebpackShellPlugin from 'webpack-shell-plugin';

const backendConfig = {
  target: 'node',
  entry: './app.ts',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals(), 'build', 'typings'],
  devtool: 'sourcemap',
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
    new WebpackShellPlugin({
      onBuildEnd: [
        'npm run development-log',
        'pm2 stop --silent ./build/app.js',
        'pm2 start --silent ./build/app.js'
      ],
      dev: false
    })
  ],
  resolve: {
    extensions: ['.ts']
  },
  module: {
    loaders: [
      {
        test: /\.ts?$/,
        exclude: 'node_modules',
        loader: 'ts-loader'
      }
    ]
  }
};

export default [backendConfig];
