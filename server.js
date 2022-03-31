/*
file: server.js
description: WEB API for movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authjwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');


require('dotenv').config({ path: './.env' });

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };
    if (req.headers != null) {
        json.headers =req.headers;
    }
    return json;
}

router.post('/signup', function(req,res){

    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save( function(err) {
            if (err) {
                if (err.code == 11000)
                    return res.json({success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);

            }
            res.json({success: true, msg: 'successfully created new user.'})
        });
    }
});
router.post('/signin', function (req,res){
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({username: userNew.username}).select('name username password').exec( function(err, user) {
        if (err) {
            res.send(err);
        }


        user.comparePassword(userNew.password, function(isMatch) {
            if(isMatch) {
                var userToken = { id: user.id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'jwt' + token});

            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }

        })
    })
});

router.route('/movie')// this is all movies
    .post(authController.isAuthenticated, function(req, res) {
            console.log(req.body);
            res = res.status(200);
            if(req.get('content-Type')) {
                res = res.type(req.get('content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.json(o);
        }
    )
    .get(authJwtController.isAuthenticated, function (req, res){
            console.log(req.body);
            res = res.status(200);
            if(req.get('content-Type')) {
                res = res.type(req.get('content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.json(o);
        }
    );
router.route('/movie/:movieId')
    .delete(authController.isAuthenticated, function(req, res) {
            const movie = movie.find(movie => movie.id.toString() === req.params.id);
            res.status(200).json(movie);
        }
    )
    .put(authjwtController.isAuthenticated, function(req, res) {
            const movie = movie.find(movie => movie.id.toString() === req.params.id);
            res.status(200).json(movie);
        }
    )
    .get(authjwtController.isAuthenticated, function(req, res) {
            const movie = movie.find(movie => movie.id.toString() === req.params.id);
            res.status(200).json(movie);
        }
    );




app.use('/', router);
app.listen(process.env.PORT || 3000);
module.exports = app; // for testing only
