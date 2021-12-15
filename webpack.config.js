import path from 'path';
const __dirname = path.resolve();

export default {
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
