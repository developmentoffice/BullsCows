const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        build: './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: (process.env.NODE_ENV === 'production' ? '/BC/' : '/'),
        filename: 'js/[name].[fullhash].js',
        assetModuleFilename: (pathData) => {
            const path = pathData.filename.split('/').slice(1).join('/')
            return `${path}?[contenthash]`
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    (process.env.NODE_ENV == 'production' ? MiniCssExtractPlugin.loader : 'style-loader'),
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    esModule: false
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.ts', '.js', '.vue']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
            '__VUE_OPTIONS_API__': true,
            '__VUE_PROD_DEVTOOLS__': false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            favicon: './src/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[fullhash].css'
        }),
        new VueLoaderPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                        }
                    ]
                }
            })
        ]
    },
    devServer: {
        hot: true,
        watchFiles: ['src/**/*'],
        host: '0.0.0.0',
        port: 'auto',
        static: {
            publicPath: '/',
            watch: {
                usePolling: true
            }
        },
        compress: true,
        https: false,
        historyApiFallback: {
            disableDotRule: true
        }
    },
    performance: {
        hints: false
    }
};
