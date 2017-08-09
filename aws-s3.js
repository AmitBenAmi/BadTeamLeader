var aws = require('aws-sdk');
var imageHandler = require('./image-handler.js');

var s3 = new aws.S3();
var bucketName = 'ChenKu';

imageHandler.readImage(
    'C:\\Users\\User\\Pictures\\Camera Roll',
    function (loadedImageData) {

        var bucketCreation = function () {
            var params = {
                Bucket: bucketName,
                Key: 'Amit Ben Ami.jpg',
                Body: loadedImageData
            };

            s3.putObject(params, function (err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.info("Successfully uploaded image Amit Ben Ami.jpg to bucket " + bucketName);
                }

            });
        };

        s3.createBucket({Bucket: bucketName}, bucketCreation);
    });