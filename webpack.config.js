const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const {resolve} = require('path');

module.exports = {
    entry: {
        'mui-icon-module': resolve(__dirname, 'src', 'module.ts'),
        'mui-icon-module.min': resolve(__dirname, 'src', 'module.ts')
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].js',
        // library: 'MuiIconModule',
        // libraryTarget: 'umd',
        // umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.ts$/,
            include: [resolve(__dirname, 'src')],
            use: [
                {
                    loader: 'babel-loader',
                    query: {
                        presets: [['es2015', {modules: false}]]
                    }
                },
                'ts-loader'
            ]
        }]
    },
    resolve: {
        extensions: ['.ts']
    },
    devtool: 'source-map',
    plugins: [
        // new CopyWebpackPlugin([{from: 'src/toolbar.css', to: 'toolbar.css'}]),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js/,
            compress: true,
            sourceMap: true
        })
    ]
}
