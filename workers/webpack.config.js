import path from 'path';
const __dirname = path.resolve();

export default {
    mode: 'development',
    entry: {
        app: './test/src/app.fy'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'test/public/')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'test/public/'),
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.fy$/,
                use: [{
                    loader: path.resolve(__dirname, './workers/farmy-loader.cjs')
                }]
            }
        ]
    }
};
