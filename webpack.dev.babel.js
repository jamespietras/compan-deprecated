import fs from 'fs';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import WebpackCleanupPlugin from 'clean-webpack-plugin';
import WebpackCopyPlugin from 'copy-webpack-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin';

const backendConfig = {
  target: 'node',
  node: { __dirname: true, __filename: true },
  entry: './app.ts',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  devtool: 'sourcemap',
  resolve: {
    extensions: ['.ts'],
    modules: ['./node_modules', './']
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, 'build'),
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'typings')
    ]),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
    new WebpackCleanupPlugin(['build']),
    new WebpackCopyPlugin([
      { from: 'views/**/*' }
    ], {
      ignore: ['*.pid', '*.seed', '*.pid.lock', '.DS_Store' ]
    }),
    new WebpackShellPlugin({
      onBuildEnd: [
        'bash ./development.sh'
      ],
      dev: false
    })
  ],
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
