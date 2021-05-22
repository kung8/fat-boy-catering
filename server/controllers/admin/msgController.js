const { TWILIO_ACCOUNT_SECRET_ID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env

module.exports = {
    updateDelay: async (req, res) => {
        const db = req.app.get('db');
        const { delay } = req.body;
        await db.delay.update_delay({ delay });
        res.sendStatus(200);
    },

    updateOutOfOfficeMessage: async (req, res) => {
        const db = req.app.get('db');
        const { message, enabled } = req.body;
        await db.message.update_out_of_office_message({ message, enabled });
        res.sendStatus(200);
    },

    sendSMS: (phone) => {
        const message = 'Your order is ready for pick up. Thank you for letting FatBoy Catering serve you!';
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