const { TWILIO_ACCOUNT_SECRET_ID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env
const hooks = require('../hooks');

module.exports = {
    updateDelay: async (req, res) => {
        const { delay } = req.body;
        hooks.updateDelay({
            id: 1,
            delay,
        });
        res.sendStatus(200);
    },

    updateOutOfOfficeMessage: async (req, res) => {
        const { message, enabled } = req.body;
        hooks.updateOutOfOfficeMessage({
            id: 1,
            message,
            enabled,
        });
        res.sendStatus(200);
    },

    sendSMS: (phone) => {
        const message = 'AUTOMATED MESSAGE:\nYour order is ready for pick up. Thank you for letting FatBoy Catering serve you!\n\nPlease text me at 801-310-4575 for any questions!';
        const accountSid = TWILIO_ACCOUNT_SECRET_ID;
        const authToken = TWILIO_AUTH_TOKEN; //declaring these as these variables or you could just put them directly as the arguments in the invocation below

        const client = require('twilio')(accountSid, authToken);
        client.messages
            .create({
                body: message,
                from: TWILIO_PHONE_NUMBER,
                to: phone
            })
            .then(message => {
                
            }).catch(err => {
                console.log(err);
            })
    }
}