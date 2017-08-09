var aws = require('aws-sdk');

var rekognition = new aws.rekognition();
var collectionId = 0;
var snapshootImgName = "snapshotImg";
var snapshootBucketName = "snapshotBuck";


var addNewCollection = function () {
    var params = {
        CollectionId: collectionId.toString()
    };

    rekognition.createCollection(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);
    });       
};

var indexFaces = function () {
    var params = {
        CollectionId: collectionId.toString(), 
        DetectionAttributes: [
    ], 
    Image: {
        S3Object: {
            Bucket: snapshootBucketName, 
            Name: snapshootImgName
            }
        }   
    };

    rekognition.indexFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data); 
 });
};

var searchFaces = function (currFaceId) {
    var params = {
        CollectionId: collectionId.toString(), 
        FaceId: currFaceId, 
        FaceMatchThreshold: 90, 
        MaxFaces: 1
    };
    
    rekognition.searchFaces(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
};