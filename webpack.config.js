const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

const main = {
  mode,
  devtool: false,
  entry: path.resolve(__dirname, 'src', 'main', 'index.ts'),
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [ 
          path.resolve(__dirname, 'src', 'main'), 
          path.resolve(__dirname, 'src', 'shared') 
        ],
        use: { 
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      }
    ]
  },
  node: {
    __dirname: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
};

const preload = {
  mode,
  devtool: false,
  entry: path.resolve(__dirname, 'src', 'preload', 'index.ts'),
  target: 'electron-preload',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [ 
          path.resolve(__dirname, 'src', 'preload'), 
          path.resolve(__dirname, 'src', 'shared') 
        ],
        use: { 
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'preload.js'
  },
  resolve: {
    extensions: [ '.ts' ],
  },
};

const renderer = {
  mode,
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'renderer', 'index.ts'),
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [ 
          path.resolve(__dirname, 'src', 'renderer'), 
          path.resolve(__dirname, 'src', 'shared') 
        ],
        use: { 
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          } 
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
    assetModuleFilename: 'assets/[hash].[ext]'
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'renderer', 'index.html'),
      inject: 'body'
    }),
  ],
  resolve: {
    extensions: [ '.ts', '.svg' ],
  },
}

module.exports = [
  main,
  preload,
  renderer,
];