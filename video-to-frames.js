var nodeWebCam = require('node-webcam');
var imageHandler = require('./image-handler');
var awsS3 = require('./aws-s3');
var webCam = nodeWebCam.create({
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: 'jpeg',
    device: false,
    callbackReturn: 'location',
    verbose: true
});

var captureImage = function () {
    webCam.capture('test_picture', function (err, data) {
        if (err) throw err;

        imageHandler.readImage('.', data, function (imageData) {
            awsS3.uploadImageToBucket('screenShot-' + Date.now(), 'jpg', imageData);
        })
    });
}

setInterval(captureImage, 10000);