const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].fy',
        path: path.resolve(__dirname, '../build')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            },
            {
                test: /\.fy$/,
                use: [{
                    loader: path.resolve('./config/farmy-loader.cjs')
                }]
            }
        ]
    }
};
