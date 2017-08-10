var aws = require('aws-sdk');
const sender = 'PAZAM';
const phones = ['+972525580822', '+972528923301', '+972526146607', '+972546246068'];

aws.config.update({region:'us-east-1'});
var sns = new aws.SNS();

sns.setSMSAttributes({
    attributes: {
        DefaultSenderID: sender
    }
}, function (err, data) {
    if (err) {
        console.error('Error in setting the sms attributes: ' + err.message);
    }
});

module.exports = {
    sendSMS: function () {
        for (var phoneIndex = 0; phoneIndex < phones.length; phoneIndex++) {
            sns.publish({
                Message: 'Something',
                PhoneNumber: phones[phoneIndex]
            }, function (error, publishData) {
                if (error) {
                    console.error('Error in sending the message: ' + error.message);
                }
                else {
                    console.info('Sent the message successfully!');
                }
            });
        }
    }
};