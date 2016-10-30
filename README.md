# Click to Call - Node.js

This is an application example implementing Click to Call (with Gathering capabilities) and SMS using Twilio.  For the original project see the original step-by-step tutorial, [visit this link](https://twilio.com/docs/howto/click-to-call).

[Read the full tutorial here](https://www.twilio.com/docs/tutorials/walkthrough/click-to-call/node/express)!

## Installation

Step-by-step on how to deploy, configure and develop on this example app.

### Fastest Deploy

Use ACCS to deploy this app.

### Configuration

#### Setting Your Environment Variables

1. Download zip or Clone repository and `cd` into it.

```
git clone git://github.com/barackd222/s2v-iia-nodejs-voicesms-apis.git


2. Are you using a bash shell? Use echo $SHELL to find out. For a bash shell, using the Gmail example, edit the ~/.bashrc or ~/.bashprofile file and add:

```
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=yyyyyyyyyyyyyyyyy
export TWILIO_NUMBER=+15556667777

```

Are you using Windows or Linux? You can learn more about how to set variables [here](https://www.java.com/en/download/help/path.xml).

### Development

Getting your local environment setup to work with this app is easy.  
After you configure your app with the steps above use this guide to
get it going locally.

1. Install the dependencies.

```
npm install
```

Override body-parser:

```
npm install body-parser
```


1. Launch local development webserver.

```
node app.js
```

1. Open browser to [http://localhost:PORT](http://localhost:PORT).

1. Tweak away on `routes/index.js`.

## Meta

* No warranty expressed or implied.  Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)

