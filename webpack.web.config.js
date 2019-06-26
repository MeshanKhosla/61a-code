const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/renderer/index.js",
        pythonWorker: "./src/web/pythonWorker.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/web"),
        globalObject: "this", // workaround for HMR, https://github.com/webpack/webpack/issues/6642
        publicPath: path.resolve(__dirname, "dist/web"),
    },
    devtool: "source-map",
    devServer: {
        contentBase: ".",
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                secure: false,
            },
        },
    },
    module: {
        noParse: /monaco-editor\/min\/vs\/loader\.js|jquery\.jsPlumb-1\.3\.10-all-min\.js/,
        rules: [
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["@babel/react"],
                },
            },
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }],
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
                loader: "url-loader",
            },
            {
                test: /\.py$/i,
                use: "raw-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    emitError: true,
                    emitWarning: true,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            excludeChunks: ["pythonWorker"],
        }),
        new webpack.DefinePlugin({
            ELECTRON: false,
            __static: JSON.stringify("./static"),
        }),
        new MonacoWebpackPlugin({
            languages: ["python", "scheme", "sql"],
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
        }),
        new CopyWebpackPlugin([{
            from: "static",
            to: "static",
        },
        {
            from: "src/web-server",
            to: ".",
        }]),
    ],

};
