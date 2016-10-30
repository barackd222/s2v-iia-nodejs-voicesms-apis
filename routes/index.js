var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var config = require("../config");

//CRI change:
var bodyParser = require('body-parser');

// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio(config.accountSid, config.authToken);

// Configure application routes
module.exports = function (app) {
    // Set Jade as the default template engine
    app.set('view engine', 'jade');

    // Express static file middleware - serves up JS, CSS, and images from the
    // "public" directory where we started our webapp process
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Parse incoming request bodies as form-encoded
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Use morgan for HTTP request logging
    app.use(morgan('combined'));

    // CRI change:    
    app.use(bodyParser.json()); // Support for json encoded bodies 
    app.use(bodyParser.urlencoded({ extended: true })); // Support for encoded bodies

    // Home Page with Click to Call 
    app.get('/', function (request, response) {
        response.render('index');
    });

    // Handle an AJAX POST request to place an outbound call
    app.post('/call', function (request, response) {
        // This should be the publicly accessible URL for your application
        // Here, we just use the host for the application making the request,
        // but you can hard code it or use something different if need be
        var url = 'http://' + request.headers.host + '/outbound';
        console.log("URL is [" + url + "]");

        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.makeCall({
            to: request.body.phoneNumber,
            from: config.twilioNumber,
            url: url
        }, function (err, message) {
            console.log(err);
            if (err) {
                //response.status(500).send(err);
            } else {
                response.send({
                    message: 'Thank you! We will be calling you shortly.'
                });
            }
        });
    });

    // Return TwiML instuctions for the outbound call
    app.post('/outbound', function (request, response) {
        // We could use twilio.TwimlResponse, but Jade works too - here's how
        // we would render a TwiML (XML) response using Jade
        response.type('text/xml');
        response.render('outbound', { msg: 'Hello, Callan. I am calling you from the Oracle Cloud. I know everything about you. I can see everything...I am watching you.' });
    });

    /** Extend origonal code to allow generic texts and APIs.  */

    // Handle an AJAX POST request to place an outbound call
    app.post('/voicecall', function (request, response) {

        // "to" and "msg" are NOT set via query or parameters anymore. Only via a POST body is allowed here.
        var to = request.body.to;
        var msg = request.body.msg;

        if (msg == null || msg == undefined || to == null || to == undefined) {
            console.log("Message or To number were not defined. Bad request found, thus nothing to do...");
            //response.sendStatus(400);//Bad request...
            return;
        }


        // This should be the publicly accessible URL for your application
        // Here, we just use the host for the application making the request,
        // but you can hard code it or use something different if need be
        var url = 'http://' + request.headers.host + '/voiceoutbound' + '?msg=' + encodeURI(msg);
        console.log("URL is [" + url + "], to is [" + to + "], msg is [" + msg + "]");

        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.makeCall({
            to: to,
            from: config.twilioNumber,
            url: url
        }, function (err, message) {
            console.log(err);
            if (err) {
                //response.sendStatus(500).send(err);
            } else {
                response.send({
                    message: 'Thank you! We will be calling you shortly.'
                });
            }
        });
    });


    // Handle an AJAX POST request to place an outbound call with Gathering (menu) capabilities
    app.post('/voicemenu', function (request, response) {

        // "to" and "name" are NOT set via query or parameters anymore. Only via a POST body is allowed here.
        var to = request.body.to;
        var name = request.body.name;

        if (name == null || name == undefined || to == null || to == undefined) {
            console.log("Name or To number were not defined. Bad request found, thus nothing to do...");
            // if (response != null && response != undefined) {
            //     response.sendStatus(400);//Bad request...
            // }
            return;
        }


        // This should be the publicly accessible URL for your application
        // Here, we just use the host for the application making the request,
        // but you can hard code it or use something different if need be
        var url = 'http://' + request.headers.host + '/voicemenuoutbound' + '?name=' + encodeURI(name);
        console.log("URL is [" + url + "], to is [" + to + "], name is [" + name + "]");

        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.makeCall({
            to: to,
            from: config.twilioNumber,
            url: url
        }, function (err, message) {
            console.log(err);
            if (err) {
                // if (response != null && response != undefined) {
                //     response.sendStatus(500).send(err);
                // }
            } else {
                response.send({
                    message: 'Thank you! We will be calling your number shortly using a menu of options.'
                });
            }
        });
    });

    // Return TwiML instuctions for the outbound call
    app.post('/voiceoutbound', function (request, response) {

        var msgTTS = request.query.msg;
        console.log("Message in /voiceoutbound call is [" + msgTTS + "]");

        // We could use twilio.TwimlResponse, but Jade works too - here's how
        // we would render a TwiML (XML) response using Jade
        response.type('text/xml');
        response.render('outbound', { msg: msgTTS });
    });


    // Return TwiML Gathering (menu) instuctions for the outbound call coming from Twilio
    app.post('/voicemenuoutbound', function (request, response) {

        var name = request.query.name;
        console.log("Name in /voicemenuoutbound call is [" + name + "]");

        // We could use twilio.TwimlResponse, but Jade works too - here's how
        // we would render a TwiML (XML) response using Jade
        response.type('text/xml');
        response.render('outboundGather', { name: name });
    });


    // Process TwiML Gather Action:
    app.get('/processmenu', function (request, response) {

        var option = request.query.Digits;
        console.log("User entered option [" + option + "]");    
            
        //Hanging up current call
        response.render('hangup');
    });


    // Handle an AJAX POST request to place an outbound call
    app.post('/sms', function (request, response) {

        // "to" and "msg" are NOT set via query or parameters anymore. Only via a POST body is allowed here.
        var to = request.body.to;
        var msg = request.body.msg;

        if (msg == null || msg == undefined || to == null || to == undefined) {
            console.log("Message or To number were not defined. Bad request found, thus nothing to do...");
            // if (response != null && response != undefined) {
            //     response.sendStatus(400);//Bad request...
            // }
            return;
        }


        // Create options to send the message
        var options = {
            to: to,
            from: config.twilioNumber,
            body: msg
        };

        // Send the message!
        client.sendMessage(options, function (err, response) {
            if (err) {
                // Just log it for now
                console.error(err);
                // if (response != null && response != undefined) {
                //     response.sendStatus(500);//Internal Server error...
                // }
                return;
            } else {
                console.log('Message [' + msg + '] sent to [' + to + ']');
            }
        });

        // Return successfully Accepted call.
        response.sendStatus(202).end();

    });

};


