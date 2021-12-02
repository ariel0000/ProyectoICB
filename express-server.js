var express = require('express');
var app = express();
var bodyParser = require("body-parser")
var path = require('path')
var webpack = require('webpack')
var config = require('./webpack.config')
var compiler = webpack(config)

app.use(express.static(path.join(__dirname, '/public')));  //Sacado de Internet

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

app.use(require('webpack-dev-middleware')(compiler, {
    index: true,
    publicPath: config.output.publicPath
}));

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8181, function(){
    console.log('Example app listening on port 8181');
})

