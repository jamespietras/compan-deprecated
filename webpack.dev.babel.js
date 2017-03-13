import fs from 'fs';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import WebpackShellPlugin from 'webpack-shell-plugin';

const backendConfig = {
  target: 'node',
  entry: ['./app.js'],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  externals: nodeExternals(),
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
        'pm2 reload build/app.js --update-env'
      ],
      dev: false
    })
  ]
};

export default [backendConfig];
