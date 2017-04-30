var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event;
var BUILD_DIRNAME = '../nwjs/app';
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var PAGE_PATH = path.resolve(ROOT_PATH, 'src', 'pages');
var BUILD_PATH = path.resolve(ROOT_PATH, BUILD_DIRNAME);

process.env.BABEL_ENV = TARGET;

var common = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        this.module.noParse.push(new RegExp('^' + name + '$'));
    },

    entry: APP_PATH,
    output: {
        path: BUILD_PATH,
        // publicPath: '/assets/',
        filename: 'bundle.js'
    },
    resolve: {
        modulesDirectories: ['node_modules', './src', './src/components', './src/components/pages'],
        extensions: ['', '.js', '.jsx'],
        alias: {}
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        // "jquery": "jQuery"
    },
    module: {
        noParse: [],
        preLoaders: [
            {
                test: /\.css$/,
                loaders: ['csslint'],
                include: APP_PATH
            }
            // ,
            // {
            //   test: /\.jsx?$/,
            //   loaders: ['eslint'],
            //   include: APP_PATH
            // }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: APP_PATH
            },
            {
                test: /\.png|jpg|jpeg|gif|svg$/,
                loader: "url?name=img/[name].[ext]&limit=10",
                include: APP_PATH
            },
            { test: /\.TTF$/, loader: 'file?name=fonts/[name].[ext]' },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=fonts/[name].[ext]' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml' },
            { test: /\.mp3(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=img/[name].[ext]' },
        ]
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new HtmlwebpackPlugin({
            title: '内部安全通信',
            filename: "index.html",
            template: 'src/htmlTemplate/index.html',
            inject: true
        })
    ],
    postcss: function () {
        return [autoprefixer({ browsers: ['last 2 versions'] })];
    }
};

if (TARGET === 'start' || !TARGET) {
    var config = merge(common, {
        entry: APP_PATH,
        devtool: 'eval-source-map',

        module: {
            loaders: [
                {
                    test: /\.less$/,
                    loader: 'style!css!postcss!less'
                },
                {
                    test: /\.css$/,
                    loaders: ['style', 'css', 'postcss'],
                    include: APP_PATH
                }
            ]
        },
        devServer: {
            port: 8889,
            // contentBase: './demo',
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            host: '0.0.0.0'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                'DEBUG': JSON.stringify('true')
            }),
        ]
    });

    var node_modules_dir = __dirname + '/node_modules';
    // config.addVendor('react$', node_modules_dir + '/react/dist/react-with-addons.js');
    // config.addVendor('react-dom$', node_modules_dir + '/react-dom/dist/react-dom.js');
    // config.addVendor('react/addons', 'react');
    // config.addVendor('react/dist', 'react');
    //config.addVendor('extend', node_modules_dir + 'src/htmlTemplate/extend.js');
    // console.log(config);

    module.exports = config;
}

if (TARGET === 'debug') {
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies),
            app: path.resolve(APP_PATH, 'index.js')
        },
        // devtool: 'inline-source-map',
        /* important! */
        output: {
            path: BUILD_PATH,
            // filename: '[name].[chunkhash].js?'
            filename: '[name].js'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract(
                        // activate source maps via loader query
                        'css!' +
                        'postcss!' +
                        'less'
                    ),
                    include: APP_PATH
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css', 'postcss'),
                    include: APP_PATH
                }
            ]
        },
        plugins: [
            new Clean([BUILD_DIRNAME]),
            // new ExtractTextPlugin('styles.[chunkhash].css'),
            new ExtractTextPlugin('styles.css', { allChunks: true }),
            new webpack.optimize.CommonsChunkPlugin(
                'vendor',
                '[name].js'
                // '[name].[chunkhash].js'
            ),
            new webpack.DefinePlugin({
                'process.env': {
                    // This affects react lib size
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ]
    });
}
if (TARGET === 'build' || TARGET === 'stats') {
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies),
            app: path.resolve(APP_PATH, 'index.js')
        },
        // devtool: 'inline-source-map',
        /* important! */
        output: {
            path: BUILD_PATH,
            // filename: '[name].[chunkhash].js?'
            filename: '[name].js?'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract(
                        // activate source maps via loader query
                        'css!' +
                        'postcss!' +
                        'less'
                    ),
                    include: APP_PATH
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css', 'postcss'),
                    include: APP_PATH
                }
            ]
        },
        plugins: [
            new Clean([BUILD_DIRNAME]),
            // new ExtractTextPlugin('styles.[chunkhash].css'),
            new ExtractTextPlugin('styles.css', { allChunks: true }),
            new webpack.optimize.CommonsChunkPlugin(
                'vendor',
                '[name].js'
                // '[name].[chunkhash].js'
            ),

            new webpack.DefinePlugin({
                'process.env': {
                    // This affects react lib size
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            //生产环境建议去掉该注释，否则文件会增加。
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}
