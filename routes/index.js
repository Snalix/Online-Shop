var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const app = require("../app");
var path = require('path');


var url = 'mongodb://localhost:27017';

router.use(function (req, res, next) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = await db.db("online_shop");
        await dbo.collection("categories").find({}, {projection: {name: 1, id: 1}}).toArray(function (err, result) {
            if (err) throw err;
            res.locals.navbar = result;
            next();
        });
    });
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.ejs', {products: false, product: false});
});

router.get('/get-products/:category', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        var dbo = db.db("online_shop");
        var category = req.params.category;
        dbo.collection("products").find({
            primary_category_id: category,
        }, {
            projection: {
                name: 1,
                price: 1,
                image_groups: 1,
                id: 1,
                price_max: 1,
            }
        }).toArray(function (err, result) {
            if (err) throw err;
            res.render('index.ejs', {products: result, product: false})
            console.log(result);
            //res.send(result);
        });
    });
})

router.get('/get-product/:id', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        var dbo = db.db("online_shop");
        var productId = req.params.id;
        dbo.collection("products").find({
                id: productId,
            }
        ).toArray(function (err, result) {
            if (err) throw err;
            res.render('index.ejs', {product: result, products: false})
            console.log(result);
            //res.send(result);
        });
    });
})
router.get('/filter/', function (req, res, next) {
    let filter = req.query;
    let neshto = {};

    MongoClient.connect(url, function (err, db) {
        var dbo = db.db("online_shop");
        var productId = req.params.id;
        dbo.collection("products").find(filter
        ).toArray(function (err, result) {
            if (err) throw err;
            res.render('index.ejs', {product: result, products: false})
            console.log(result);
            //res.send(result);
        });
    });
})

router.use('/get-products/:category', express.static(path.join(__dirname, '/public')));
router.use('/get-product/:product', express.static(path.join(__dirname, '/public')));


module.exports = router;
