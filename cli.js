#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// const rootPath = path.resolve(__dirname, '../..');
const rootPath = process.env.PWD;
const projectName = process.argv[2] || 'farmy';

fs.mkdirSync(rootPath + '/config');
// config webpack prod
fs.writeFileSync(rootPath + '/config/webpack.prod.js', `

const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js',
        // path: path.resolve(__dirname, 'public')
        // path: path.resolve(__dirname, '../dist-pro')
        path: path.resolve(__dirname, '../public')
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
            }
        ]
    }
};

`);

// config webpack dev
fs.writeFileSync(rootPath + '/config/webpack.dev.js', `
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../public')
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
            }
        ]
    }
};
`);

fs.mkdirSync(rootPath + '/public');
// public index.html
fs.writeFileSync(rootPath + '/public/index.html', `

<!doctype html>
<html lang="en">
<head>
    <!--  meta  -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="Farmy Project">

    <!--  script  -->
    <script src="./app.js" defer></script>

    <!--  title  -->
    <title>${projectName}</title>
</head>
<body>

<!--  root  -->
<div id="root"></div>

<!--  noscript  -->
<noscript>You need to enable JavaScript to run this app.</noscript>

</body>
</html>

`);

fs.mkdirSync(rootPath + '/src');
// src app.js
fs.writeFileSync(rootPath + '/src/app.js', `

import {$} from 'farmy';

const $root = $('#root');
$root.innerHTML('<h1>${projectName}</h1>');

`);

// package json
const pkgPATH = path.resolve(__dirname, './package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPATH, 'utf8'));

fs.writeFileSync(rootPath + '/package.json', JSON.stringify({
    "name": projectName,
    "version": "0.0.0",
    "description": projectName,
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack serve --open --config config/webpack.dev.js",
        "watch:dev": "webpack -watch --config config/webpack.dev.js",
        "watch:prod": "webpack -watch --config config/webpack.prod.js",
        "build:dev": "webpack --config config/webpack.dev.js",
        "build:prod": "webpack --config config/webpack.prod.js"
    },
    "author": "Nikhil Salooniya",
    "license": "ISC",
    "dependencies": {
        "farmy": `^${pkg.version}`
    },
    "devDependencies": {
        "css-loader": "^5.2.4",
        "sass": "^1.32.12",
        "sass-loader": "^11.0.1",
        "style-loader": "^2.0.0",
        "webpack": "^5.36.2",
        "webpack-cli": "^4.7.0",
        "webpack-dev-server": "^3.11.2"
    }
}))

const {execSync} = require('child_process');

console.log('==== SETTING THINGS UP ===');
console.log('=> this may take some time');
execSync("npm install");
console.log('==== SETUP COMPLETED ===');
console.log('=> run - npm start');

