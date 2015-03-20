'use strict';

var assert = require("assert");

module.exports = {

    MSG_EXPECT_ANY_RESULT: 'should trigger the resolve callback with a non null result',
    MSG_EXPECT_RESULT: 'should trigger the resolve callback with a result equal to the expected result',
    MSG_EXPECT_VALID_KEY: 'should trigger the resolve callback with a positive integer result',
    MSG_EXPECT_NO_RESULT: 'should trigger the resolve callback with a null result',
    MSG_EXPECT_ERROR: 'should trigger the reject callback with a non null error message',

    expectAnyResult: function (func, args, done) {
        return func.apply(null, args)
            .then(function (result) {
                try {
                    assert(result != null, 'Expected non-null result, found null');
                } catch (e) {
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            });
    },

    expectResult: function (func, args, expectedResult, done) {
        return func.apply(null, args)
            .then(function (result) {
                // Represent all values as strings
                // Because that's how they come back from the db
                // Need to test assert.deepEqual/strictEqual/etc and replace this
                var replacer = function (key, value) {
                    if (typeof value === 'number') return value.toString();
                    if (typeof value === 'boolean') return value.toString();
                    return value;
                };
                var resultJson = JSON.stringify(result, replacer);
                var expectedJson = JSON.stringify(expectedResult, replacer);
                try {
                    //assert(resultJson === expectedJson, 'Result not equal to expected (compare as json using ===)');
                    //assert.strictEqual(resultJson, expectedJson, 'Result not equal to expected (compare as json with strictEqual)');
                    assert.deepEqual(result, expectedResult, 'Result not equal to expected (compare with deepEqual)');
                } catch (e) {
                    console.log('EXPECTED: ' + expectedJson);
                    console.log('ACTUAL:   ' + resultJson);
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
                return result;
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            });
    },

    expectResultWithValidKey: function (func, args, expectedResult, keyKey, done) {
        return func.apply(null, args)
            .then(function (result) {
                try {

                    var key = result[keyKey];
                    delete result[keyKey];
                    //console.log('VALIDATE ' + keyKey + ' IS VALID : ' + key);
                    assert(key != null, 'Expected non-null key, found null');
                    assert(key === parseInt(key) || key === parseInt(key).toString(), 'Expected key to be an integer (or string representation), found ' + key);
                    assert(parseInt(key).toString() === key, 'Expected key to be a string representation of an integer, found ' + key);
                    //assert(key === parseInt(key), 'Expected key to be an integer, found ' + key);
                    assert(key > 0, 'Expected key greater than zero, found ' + key);

                    assert.deepEqual(result, expectedResult, 'Result not equal to expected (compare with deepEqual)');

                } catch (e) {
                    console.log('EXPECTED: ' + JSON.stringify(expectedResult) + ' WITH VALID KEY');
                    console.log('ACTUAL:   ' + JSON.stringify(result));
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
                return key;
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            });
    },

    expectValidKey: function (func, args, done) {
        return func.apply(null, args)
            .then(function (key) {
                try {
                    assert(key != null, 'Expected non-null key, found null');
                    assert(key === parseInt(key) || key === parseInt(key).toString(), 'Expected key to be an integer (or string representation), found ' + key);
                    //assert(parseInt(key).toString() === key, 'Expected key to be a string representation of an integer, found ' + key);
                    assert(key === parseInt(key), 'Expected key to be an integer, found ' + key);
                    assert(key > 0, 'Expected key greater than zero, found ' + key);
                } catch (e) {
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
                return key;
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            });
    },

    expectNoResult: function (func, args, done) {
        return func.apply(null, args)
            .then(function (result) {
                try {
                    assert(result == null, 'Expected null result, found non-null');
                } catch (e) {
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            });
    },

    expectError: function (func, args, done) {
        return func.apply(null, args)
            .then(function (result) {
                var err = new Error("Failed to fail " + JSON.stringify(result));
                if (done) done(err);
                else throw err;
            }, function (err) {
                console.log('RECEIVED ERROR AS EXPECTED: ' + err);
                try {
                    assert(err != null, 'Expected non-null error message, found null');
                } catch (e) {
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
            });
    }

};
