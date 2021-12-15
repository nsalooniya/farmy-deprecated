const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './test/src/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'test/public/')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'test/public/'),
        historyApiFallback: true
    }
};
