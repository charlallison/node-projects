const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: {
            email: process.env.SENDER_EMAIL,
            name : process.env.SENDER_NAME
        },
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: {
            email: process.env.SENDER_EMAIL,
            name : process.env.SENDER_NAME
        },
        subject: 'Before you leave',
        text: `Sad to see you leave ${name}. Is there anything we would have done to have you stay back?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
