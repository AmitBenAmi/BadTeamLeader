var compareFlow = require('./compare-flow');

// When new face is required for learning
exports.subscribeNewFace = function (event, context, callback) {
    console.info('Subscribing new face');

    // compareFlow.addFaceToCollection();
};

// Comparing between faces
exports.faceComparer = function (event, context, callback) {
    console.info('Starting the face comparison');
    console.info(event.Records[0].s3.bucket.name);
    console.info(event.Records[0].s3.object.key);
};

// Notifying
exports.notificationHandler = function (event, context, callback) {
};