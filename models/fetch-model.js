const MongoClient = require('mongodb').MongoClient;
var db = require('.../db_connection');
// create an schema
module.exports= {
    fetchData: function (callback) {
        var dbo = db.db("online_shop");
        dbo.collection("categories").find({}, {projection: {name: 1}}).toArray(function (err, result) {
            dbo.exec(function (err, result) {
                if (err) throw err;
                return callback(result);
            });
        });
    }
}

