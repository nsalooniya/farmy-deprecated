const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './test/src/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'test/build/')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'test/build/'),
        historyApiFallback: true
    }
};
