// Create and start server on configured port
var config = require('./config');
var server = require('./server');
server.listen(config.port, function() {
    console.log('Express server running on port ' + config.port);

    // Temp:
    console.log('accountSid is [' + config.accountSid + "], authToken is [" + config.authToken + "], twilioNumber is [" + config.twilioNumber + "]");
});