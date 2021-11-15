module.exports = {
    entry: [
        __dirname + "/app/App.js",
    ],
    output: {
        path: __dirname + "/public",
        filename: "bundle.js",
        publicPath: "/public"
    },

    devServer:{
        port: 8082,
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env', 'react'],
                plugins: ["jsx-control-statements"]
            }
        }]
    }
};
    