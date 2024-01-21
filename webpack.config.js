// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TeaserWebpackPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isDev = process.env.NODE_ENV === 'development'

const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const plugins = () => {
  const config = [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: !isDev
      }
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new CleanWebpackPlugin()
  ]

  // if (!isDev) config.push(new BundleAnalyzerPlugin())

  return config
}

const optimization = () => {
  const config = {
    // splitChunks: {
    //   chunks: false
    // },
    minimizer : []
  }
  if (!isDev) config.minimizer = [
    new OptimizeCssAssetsWebpackPlugin(),
    new TeaserWebpackPlugin()
  ]
  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: [
    '@babel/polyfill',
    './index.js'
  ],
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: false,
          runtimeCompiler: true,
          shadowMode: true,
          customElement: true
        }
      },
      {
        test: /.(sc|sa|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false
            }
          },
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        use: [
          'file-loader'
        ],
      },
    ],
  },
  devtool: isDev ? 'source-map' : 'eval',
  devServer: {
    port: 3000,
    hot: isDev,
    devMiddleware: {
      writeToDisk: true,
    }
  }
}
