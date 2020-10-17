var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const crypto = require("crypto");

const fetch = require("node-fetch");

const userTemperature = require('../models/userTemperature');
const Temperature = require('../models/temperature');

var router = express.Router();

router.use(bodyParser.json());

function getCity(lat, lng) { 
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(); 

        // Paste your LocationIQ token below. 
        xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.9d762d49a6c4e450d827f5358f7dd74f&lat=" + 
        lat + "&lon=" + lng + "&format=json", true); 
        xhr.send(); 
        xhr.onreadystatechange = processRequest; 
        xhr.addEventListener("readystatechange", processRequest, false); 

        function processRequest(e) { 
            if (xhr.readyState == 4 && xhr.status == 200) { 
                var response = JSON.parse(xhr.responseText); 
                var city = response.address.city; 
                console.log(city); 
                resolve(city);
            } 
        } 
    });
} 

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + req.query.lat + '&lon=' + req.query.lon + '&appid=ddaa54c83250e680629b9fee931415cc&units=metric')
      .then((response) => {
        return response.json();
    }).then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    })
    /*
    fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=ddaa54c83250e680629b9fee931415cc')
      .then((response) => {
        return response.json();
    }).then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    })*/
});

router.route('/add').post(authenticate.verifyUser, (req, res, next) => {
    //console.log(req.body);
    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'application/json');
    //res.json("Ok");
    console.log(req.body);
    console.log(req.user._id);
    
    getCity(req.body.lat, req.body.lng).then((city) => {
        console.log(city);
        req.body.city = city;
        req.body.record = crypto.randomBytes(16).toString("hex");
        Temperature.create(req.body)
    .then((temp) => {
        console.log('Data Created ', temp);
        
        userTemperature.findOne({ user: req.user._id}).then((temperature) => { 
        
                if (temperature == null) {
                    //console.log("Here" + req.body);
                    userTemperature.create({user: req.user._id, meteo: temp._id})
                    .then((myMeteo) => {
                        console.log('Meteo Created ', myMeteo);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(myMeteo);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }
                else {
                    //console.log("Here2");
                    temperature.meteo.push(temp._id);

                    temperature.save()
                        .then((temp1) => {
                            userTemperature.find({ user: req.user._id})
                            .populate('user')
                            .populate('meteo')
                            .then((temp2) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(temp2);  
                            })               
                        }, (err) => next(err));
                }
            });
        }, (err) => next(err))
        .catch((err) => next(err));
    });
    
    
});

router.route('/get').get(authenticate.verifyUser, (req,res,next) => {
    userTemperature.find({ user: req.user._id})
    .populate('user')
    .populate('meteo')
    .then((temps) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(temps);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.route('/remove/:id').delete(authenticate.verifyUser, (req, res, next) => {
    userTemperature.findOne({ user: req.user._id})
        .populate('meteo')
        .then((data) => { 
        if (data != null) {
            for (var i = (data.meteo.length - 1); i >= 0; i--) {
                if (data.meteo[i]._id == req.params.id) {
                    data.meteo[i].remove();
                }
            }
            data.save()
            .then((data1) => {
                userTemperature.find({ user: req.user._id})
                .populate('user').populate('meteo')
                .then((data2) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data2);  
                })               
            }, (err) => next(err));
        }
        else {
            
        }
    })
    .catch((err) => next(err));   
});


module.exports = router;
