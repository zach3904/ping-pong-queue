'use strict';

var _ = require('underscore');
var testValidators = require('./TestValidators');

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
                    testValidators.expectNonNull(result);
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
                try {
                    testValidators.expectResult(result, expectedResult);
                } catch (e) {
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

    expectResultById: function (func, args, resultFetcher, id, expectedResult, done) {
        return func.apply(null, args)
            .then(function (ignored) {
                return resultFetcher(id);
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            })
            .then(function (result) {
                try {
                    testValidators.expectResult(result, expectedResult);
                } catch (e) {
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

    expectResultByReturnedId: function (func, args, resultFetcher, expectedResult, done) {
        return func.apply(null, args)
            .then(function (id) {
                return resultFetcher(id);
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            })
            .then(function (result) {
                try {
                    testValidators.expectResult(resultFetcher, result, expectedResult);
                } catch (e) {
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

    expectSubsetMatchById: function (func, args, resultFetcher, id, expectedResultSubset, done) {
        return func.apply(null, args)
            .then(function (ignored) {
                return resultFetcher(id);
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            })
            .then(function (result) {
                try {
                    testValidators.expectSubsetMatch(result, expectedResultSubset);
                } catch (e) {
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

    expectSubsetMatchByReturnedId: function (func, args, resultFetcher, expectedResultSubset, done) {
        return func.apply(null, args)
            .then(function (id) {
                return resultFetcher(id);
            }, function (err) {
                if (done) done(new Error(err));
                else throw new Error(err);
            })
            .then(function (result) {
                try {
                    testValidators.expectSubsetMatch(result, expectedResultSubset);
                } catch (e) {
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
                    testValidators.expectValidKey(result[keyKey], keyKey);
                    testValidators.expectSubsetMatch(result, expectedResult)
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

    expectValidKey: function (func, args, done) {
        return func.apply(null, args)
            .then(function (key) {
                try {
                    testValidators.expectValidKey(key);
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
            .then(function (noresult) {
                try {
                    testValidators.expectNull(noresult);
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

    expectEmptyArray: function (func, args, done) {
        return func.apply(null, args)
            .then(function (result) {
                try {
                    testValidators.expectEmptyArray(result);
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
                    //testValidators.expectNonEmptyString(err);
                    testValidators.expectError(err);
                } catch (e) {
                    if (done) done(e);
                    else throw e;
                    return;
                }
                if (done) done();
            });
    }

};
