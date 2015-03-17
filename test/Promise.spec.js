/* global describe, it, before, after, beforeEach, afterEach */

var Promise = require("promise");
var assert = require("assert");

describe('Promise Tests', function () {

    it('should call the reject handler of the next "then" in the promise chain if an error is thrown', function (done) {
        new Promise(function (resolve, reject) {
            console.log('RESOLVE ORIGINAL PROMISE');
            resolve(true);
        }).then(function (result) {
                console.log('IN SUCCESS HANDLER');
                console.log('THROWING AN ERROR');
                throw new Error('Test Error');
            }, function (err) {
                done('This should not happen');
            })
            .then(
            function (result) {
                done('Called success handler');
            }, function (err) {
                console.log("THROWN ERROR RESULTED IN CALL TO ERROR HANDLER! SUCCESS!");
                console.log('THROWN ERROR: ' + err)
                done();
            });
    });

});
