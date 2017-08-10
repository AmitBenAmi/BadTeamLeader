var aws = require('aws-sdk');
var compare = require('./compareFaces');
var s3 = require('./aws-s3');
var sns = require('./aws-sns');
var facesCollection = "facesTiraNg";
var awsS3 = new aws.S3();
var dbNames =  [];
var facesInHour = [];
var minCounter = 0;

aws.config.update({region:'us-east-1'});
var insertFaceIdToDb = function(data, imgName) {
        s3.updateTagForImage(imgName, data.FaceRecords[0].Face.FaceId, function () {
            console.log("face " + imgName + " was updated to the faces db");
        });    
};

var getNamesByIds = function(callback, matcheIds) {
    var matchNames = [];
    
    for (var matchId in matcheIds)
    {
        s3.getImageName(matcheIds[matchId], function(data) {
            matchNames.push(data);

            if (matchNames.length == matcheIds.length)
            {
                callback(matchNames);
            }            
        });
    }
};

var compareFacesIds = function(callback) {
    var matches = [];
    var minToCheck = (60 + (minCounter - 10)) % 60; 
    if (facesInHour[minCounter - 1] != undefined)
    {
        for (var faceId in facesInHour[minCounter - 1])
        {
            if ((facesInHour[minCounter - 1].indexOf(facesInHour[minCounter - 1][faceId])) >= 0)
            {
                matches.push(facesInHour[minCounter - 1][faceId]);
            }
        }

        callback(matches); 
    }

    console.log("These are the faceId that matches" + matches);     
};

module.exports = {    
    addFaceToCollection: function(imgName) {    
        dbNames.push(imgName.substr(0, imgName.length - 5));
        compare.indexFaces(function(data) {
            insertFaceIdToDb(data, imgName);
            console.log("face " + imgName + " was finished being added to the faces db and collection");
        }, facesCollection, s3.bucketName, imgName);            
    },
    searchByImg: function(snapName) {
        compare.searchFaceByImage(function(data) {
            var facesInMinute = [];
            
            for (var faceIndex in data.FaceMatches)
            {
                if (data.FaceMatches[faceIndex].Similarity > 90)
                {
                    facesInMinute.push(data.FaceMatches[faceIndex].Face.FaceId);
                }
            }
            
            var historyCallback = function () {
                facesInHour[minCounter] = facesInMinute;
                minCounter = (minCounter + 1) % 60;
                compareFacesIds(function (matcheIds) {
                    getNamesByIds(function (matcheNames) {

                        console.log("the name that is mitchapshen is " + matcheNames[0] + "!!!!");
                        sns.sendSMS();
                        module.exports.insertHistoryToBucket();
                    }, matcheIds);
                });
            };

            module.exports.getHistoryfromBucket(historyCallback);             
        }, snapName);   
        
        
    },
    insertHistoryToBucket: function() {
        var params = {
                Bucket: "faces-ids-history",
                Key: "FacesInHour",
                Body: JSON.stringify(facesInHour)
            };

        awsS3.putObject(params, function (err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.info('Successfully uploaded facesInHour');                    
                }
            });

        params = {
            Bucket: "faces-ids-history",
            Key: "minCounter",
            Body: minCounter.toString()
        };

        awsS3.putObject(params, function (err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.info('Successfully uploaded minCounter');                    
                }
            });
    },
    getHistoryfromBucket : function(callback) {
        var params = {
            Bucket: "faces-ids-history",
            Key: "FacesInHour" 
        };

        awsS3.getObject(params, function(err, res){
            if (err) {console.log(err);}
            else {
                facesInHour = res.Body;
                
                var params = {
                    Bucket: "faces-ids-history",
                    Key: "minCounter"};

                    awsS3.getObject(params, function(err, result){
                        if (err) {console.log(err);}
                        else {
                            minCounter = parseInt(result);

                            if (callback && typeof(callback) == 'function') {
                                callback();
                            }
                        }
                    });                        
            }
        });       
    }    
};

//compare.addNewCollection("facesTiraNg");
module.exports.searchByImg("screenShot.jpg");
//module.exports.addFaceToCollection("Tali Cohen.jpg");
//module.exports.insertHistoryToBucket();


