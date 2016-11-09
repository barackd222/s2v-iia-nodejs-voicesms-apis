var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var config = require("../config");
var http = require('http');
var https = require('https');

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


    // Handle an AJAX POST request to place an outbound call
    app.get('/getcall', function (request, response) {

        // "to" and "msg" are NOT set via query or parameters anymore. Only via a POST body is allowed here.
        var to = request.query.to;
        var msg = request.query.msg;

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
            from: config.localTwilioNumber,
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
            from: config.localTwilioNumber,
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

        //If 1: Send a message to Salesforce
        //If 2: Send a message to Facebook  
        //If 3: Send a message to LinkedIn
        //If 4: Call Franco and ask him what to do...
        var currentdate = new Date();
        var datetime = "Message sent at: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        var msgToBeSent = "Hello, this message was produced using Twilio APIs in Oracle ";
        msgToBeSent += "Application Container Cloud Service and subsequently integrated ";
        msgToBeSent += "via Oracle Integration Cloud Service. ";
        msgToBeSent += datetime + ". We wish you happy APIs...";

        if (option != null && option != undefined) {

            switch (option) {

                case "1":
                    var voiceMsg = "Thank you we are going to send a message to Salesforce. Good bye";

                    // Call the API
                    callAPI("Salesforce", msgToBeSent);

                    //Callback to Twilio with a voice response.
                    response.type('text/xml');
                    response.render('outbound', { msg: voiceMsg });

                    break;

                case "2":
                    var voiceMsg = "Thank you we are going to send a message to Facebook. Good bye";

                    // Call the API
                    callAPI("Facebook", msgToBeSent);

                    //Callback to Twilio with a voice response.
                    response.type('text/xml');
                    response.render('outbound', { msg: voiceMsg });

                    break;

                case "3":
                    var voiceMsg = "Thank you we are going to send a message to LinkedIn. Good bye"

                    // Call the API
                    callAPI("LinkedIn", msgToBeSent);

                    //Callback to Twilio with a voice response.
                    response.type('text/xml');
                    response.render('outbound', { msg: voiceMsg });

                    break;

                case "4":
                    var mobile = "+61414567657";//Franco's mobile'
                    var name = "Franco";
                    response.type('text/xml');
                    response.render('callSomeone', { name: name, mobile: mobile });
                    break;

                default:
                    console.log("Unknown option!!! Nothing to do...");
                    //Hanging up current call
                    response.type('text/xml');
                    response.render('hangup');

            }
        }


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


    // Processing bulk voice calls
    app.post('/notification/bulk/:type', function (request, response) {

        console.log("Processing a bulk Notifications...");

        var type = request.params.type;

        if (type == null || type == undefined || (type != "sms" && type != "voicecall")) {
            console.log("Bulk type incorrect or not present... Nothing to do...");
            //response.sendStatus(400);//Bad request...
            return;
        }

        // Point to array of values...
        var values = request.body.values;

        if (values == null || values == undefined) {
            console.log("Bulk payload detected but no values on it... Nothing to do...");
            //response.sendStatus(400);//Bad request...
            return;
        }


        for (i = 0; i < values.length; ++i) {

            // Get current key:
            currentValue = values[i];

            // Do something here with the value...
            to = currentValue.to;
            msg = currentValue.msg;
            console.log("Displaying current value. to is [" + to + "], msg is [" + msg + "]");


            if (msg == null || msg == undefined || to == null || to == undefined) {
                console.log("Message or To number were not defined. Bad request found, thus nothing to do...");
                //response.sendStatus(400);//Bad request...
                return;
            }


            // Call the voicecall API:        
            var host = request.headers.host;
            host = host.indexOf(":") != -1 ? host.substring(0, host.indexOf(":")) : host;
            var port = config.port;
            var path = "/" + type;
            var method = "POST";
            var body = JSON.stringify(currentValue);

            // Send action to take off AR Drone 2.0
            sendRequest(host, port, path, method, body, false);
        }

        console.log("It is done iterating... Finished processing bulk values. Good bye!");
        // Return successfully Accepted call.
        response.sendStatus(202).end();
    });


    function callAPI(target, msg) {

        // Command the AR Drone 2 to take off, stay and land!
        var host = config.ICS_SERVER;
        var port = 443;
        var path = "/integration/flowapi/rest";
        var method = "POST";
        var body = null;

        // Assessing the target:
        switch (target) {

            case "Salesforce":
                path += "/S2VSALESFORCETORESTINTEGRATION/v01/salesforce/campaign";
                body = '{"Id":"70190000000Xf4w", "Description":"' + msg + '"}';
                break;

            case "Facebook":
                path += "/S2VFACEBOOKINTEGRATION/v01/social/facebook/message";
                body = '{"message":"' + msg + '"}';
                break;

            case "LinkedIn":
                path += "/S2VLINKEDININTEGRATION/v01/social/linkedin/message";
                body = '{"message":"' + msg + '"}';
                break;

            default:
                console.log("Unknown target!!! Nothing to do...");
                return;
        }

        // Send action to take off AR Drone 2.0
        sendRequest(host, port, path, method, body, true);
    }

    function sendRequest(host, port, path, method, post_data, secured) {

        var post_req = null;
        var username = config.ICS_USERNAME;
        var passw = config.ICS_PASSWORD;


        var options = {
            host: host,
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Content-Length': post_data.length,
                'Authorization': 'Basic ' + new Buffer(username + ':' + passw).toString('base64')
            }
        };

        if (secured) {

            post_req = https.request(options, function (res) {

                console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('Response: ', chunk);
                });
            });

        } else {

            post_req = http.request(options, function (res) {

                console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('Response: ', chunk);
                });
            });

        }


        post_req.on('error', function (e) {
            console.log('There was a problem with request: ' + e.message);
        });

        post_req.write(post_data);
        post_req.end();

    }

};


