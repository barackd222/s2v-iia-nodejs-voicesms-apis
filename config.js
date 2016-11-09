// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {
    // Twilio Account SID - found on your dashboard
    accountSid: process.env.TWILIO_ACCOUNT_SID,

    // Twilio Auth Token - found on your dashboard
    authToken: process.env.TWILIO_AUTH_TOKEN,

    // A Twilio number that you have purchased through the twilio.com web
    // interface or API
    twilioNumber: process.env.TWILIO_NUMBER,

    // A Local Twilio number that you have verified through the twilio.com web
    // interface or API
    localTwilioNumber: process.env.LOCAL_TWILIO_NUMBER,

    // ICS Details:
    ICS_SERVER: process.env.ICS_SERVER,
    ICS_USERNAME: process.env.ICS_USERNAME,
    ICS_PASSWORD: process.env.ICS_PASSWORD,

    // The port your web application will run on
    port: process.env.PORT || 3005
};