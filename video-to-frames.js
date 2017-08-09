var nodeWebCam = require('node-webcam');
var imageHandler = require('./image-handler');
var awsS3 = require('./aws-s3');
var fs = require('fs');
const tempImageName = 'capPicture.jpg';
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
    console.info('Capturing a new image...');
    webCam.capture(tempImageName, function (err, data) {
        if (err) throw err;

        imageHandler.readImage('.', data, function (imageData) {
            var deleteSavedPhoto = function () {
                fs.unlink(tempImageName, function (err) {
                    if (err) {
                        console.error('Could not delete photo ', tempImageName + '. Reason: ' + err.message);
                    }
                    else {
                        console.info('Deleted photo ' + tempImageName);
                    }
                });
            };

            awsS3.uploadImageToBucket('screenShot-' + Date.now(), 'jpg', imageData, deleteSavedPhoto);
        })
    });
}

setInterval(captureImage, 10000);