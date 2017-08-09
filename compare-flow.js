var compare = require('./compareFaces');
var s3 = require('./aws-s3');

module.exports = {
    collectionId: 1,
    facesCollection: "facesTiraNg",
    dbNames: [],
    facesInHour: [],
    minCounter: 0,
    addFaceToCollection: function(imgName) {    
        dbNames.push(imgName.substr(0, imgName.length - 5));
        compare.indexFaces(insertFaceIdToDb(data, imgName), facesCollection, s3.bucketName, imgName);    
    },
    insertFaceIdToDb: function(data, imgName) {
        s3.updateTagForImage(imgName, data.Face.FaceId);    
    },
    searchByImg: function(callback, snapName) {
        compare.searchFaceByImage(function(data) {
            var facesInMinute = [];
            
            for (var face in data.FaceMatches)
            {
                facesInMinute.push(face.Face.FaceID);
            }

            facesInHour[minCounter] = facesInMinute;
            minCounter = (minCounter + 60) % 60;
            this.compareFacesIds(function (matcheIds){
                this.getNamesByIds(function(matcheNames) {
                    
                }, matcheIds)
            }) 
        })
    },
    getNamesByIds: function(callback, matcheIds) {
        var matchNames = [];
        
        for (var matchId in matcheIds)
        {
            matchNames.push();
        }

        callback(matchNames);
    },
    compareFacesIds: function(callback) {
        var matches = [];
        var minToCheck = (60 + (minCounter - 10)) % 60; 
        if (facesInHour[minToCheck] != undefined)
        {
            for (var faceId in facesInHour[minCounter])
            {
                if ((facesInHour[minToCheck].indexOf(faceId)))
                {
                    matches.push(faceId);
                }
            }

            callback(matches); 
        }     
    }
};