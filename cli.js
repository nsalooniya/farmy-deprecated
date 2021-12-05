#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

const logYellow = (log) => console.log('\x1b[33m%s\x1b[89m', log);
const logBlue = (log) => console.log('\x1b[36m%s\x1b[89m', log);
const logRed = (log) => console.log('\x1b[31m%s\x1b[89m', log);

logBlue('==== SETTING THINGS UP ===');
logBlue('=> this may take some time');


try {

    // const rootPath = path.resolve(__dirname, '../..');
    let rootPath = process.env.PWD;
    const projectName = process.argv[2] || 'farmy';

    // ==== make project root folder
    rootPath = rootPath + '/' + projectName;
    fs.mkdirSync(rootPath);
    logYellow('* project root folder created');
    // ====

    fs.mkdirSync(rootPath + '/config', {
        recursive: true
    });
    logYellow('* config folder created');

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
            // path: path.resolve(__dirname, '../public')
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
                }
            ]
        }
    };

    `);
    logYellow('* config/webpack.prod.js created');

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
            // path: path.resolve(__dirname, '../public')
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
                }
            ]
        }
    };
    `);
    logYellow('* config/webpack.dev.js created');

    fs.mkdirSync(rootPath + '/public', {
        recursive: true
    });
    logYellow('* public folder created');

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
        <script src="/app.js" defer></script>

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
    logYellow('* public/index.html created');


    fs.mkdirSync(rootPath + '/src', {
        recursive: true
    });
    logYellow('* src folder created');

    // src app.js
    fs.writeFileSync(rootPath + '/src/app.js', `

    import {$} from 'farmy';

    const $root = $('#root');
    $root.innerHTML('<h1>${projectName}</h1>');

    `);
    logYellow('* src/app.js created');

    // package json
    const pkgPATH = path.resolve(__dirname, `./package.json`);
    const pkg = JSON.parse(fs.readFileSync(pkgPATH, 'utf8'));
    logYellow('* farmy/package.json read completed');

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
            "build:dev": "rm -rf build/ && webpack --config config/webpack.dev.js && cp -r public/* build",
            "build:prod": "rm -rf build/ && webpack --config config/webpack.prod.js && cp -r public/* build"
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
        },
        "__devDependencies": {
            "css-loader": "5.2.6",
            "sass": "1.34.1",
            "sass-loader": "12.1.0",
            "style-loader": "2.0.0",
            "webpack": "5.38.1",
            "webpack-cli": "4.7.2",
            "webpack-dev-server": "3.11.2"
        }
    }));
    logYellow('* package.json created');


    execSync(`cd ${projectName} && npm install`);
    logBlue('* cd project-name && npm install completed');

    logBlue('==== SETUP COMPLETED ===');
    logBlue('=> cd into project folder');
    logBlue('=> npm start');

} catch (err) {
    logRed('=== SETUP FAILED ===');
    logRed('=> ' + err);
}

