// Load the SDK
var AWS = require('aws-sdk')
var Stream = require('stream');
var Speaker = require('speaker')

// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

let params = {
    'Text': 'Hello',
    'OutputFormat': 'pcm',
    'VoiceId': 'Kimberly'
}

Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
        console.log(err.code)
    } else if (data) {
        if (data.AudioStream instanceof Buffer) {
            var bufferStream = new Stream.PassThrough();
            bufferStream.end(data.AudioStream);
            var speaker = new Speaker({
                channels: 1,
                bitDepth: 16,
                smapleRate: 16000
            });
            bufferStream.pipe(speaker);
        }
    }
})