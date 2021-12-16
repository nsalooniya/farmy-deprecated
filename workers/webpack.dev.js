const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.fy'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../build')
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        contentBase: ['./public'],
        watchContentBase: true,
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    module: {
        rules: [
            {
                test: /.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.(png|jpg|jpeg|svg)$/i,
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
