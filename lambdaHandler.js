var compareFlow = require('./compare-flow'),
    awsSns = require('./aws-sns');

// Notifying
var notificationHandler = function (event, context, callback) {
    console.info('Sending a notification to the subscribers');
    awsSns.sendSMS();
};

// When new face is required for learning
exports.learnNewFace = function (event, context, callback) {
    console.info('Subscribing new face');
    compareFlow.addFaceToCollection(event.Records[0].s3.object.key);
};

// Comparing between faces
exports.faceComparer = function (event, context, callback) {
    console.info('Starting the face comparison');
};