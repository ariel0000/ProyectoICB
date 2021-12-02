module.exports = {
    mode: 'development',
    entry: [
        __dirname + "/app/App.js",
    ],
    output: {
        path: __dirname + "/public",
        filename: "bundle.js",
        publicPath: "/public"
    },

    devServer:{
        port: 8082
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
};
    