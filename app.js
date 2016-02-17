var MongoClient = require('mongodb').MongoClient,
    express = require('express'),
    app = express();

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('App listening at http://localhost:%s', port);
});

MongoClient.connect('mongodb://localhost:27017/engRusDictionary', function (err, db) {
    "use strict";
    if (err) throw err;

    var collection = db.collection('dictionary');

    app.use(express.static('public'));

    app.set('views', __dirname+'/views');
    app.set('view engine', 'jade');

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/translate/:word', function (req, res) {
        var wordToTranslate = req.params.word;
        collection.find({'targetWord':wordToTranslate,'translation.short':{$nin: [""," "]}}, {_id:0}).toArray(function(err, doc) {
            if(err) throw err;
            res.json(doc);
        });
    });

});