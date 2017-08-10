var compareFlow = require('./compare-flow'),
    awsSns = require('./aws-sns');

// Notifying
var notificationHandler = function (event, context, callback) {
    console.info('Sending a notification to the subscribers');
};

// When new face is required for learning
exports.learnNewFace = function (event, context, callback) {
    console.info('Subscribing new face');
    var imageName = event.Records[0].s3.object.key.split('+').join(' ');
    console.info('Image is: ' + imageName);
    compareFlow.addFaceToCollection(imageName);
};

// Comparing between faces
exports.faceComparer = function (event, context, callback) {
    console.info('Starting the face comparison');

    //compareFlow.searchByImg();
};