/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var Promise = require("promise");
var testSetup = require('../TestSetup');
var testValidators = require('../TestValidators');
var testCases = require('../TestCases');
var matchQueueDAO = require('../../server/daos/MatchQueueDAO');

var testData;

describe('MatchQueueDAO', function () {

    beforeEach(function (done) {
        console.log('');
        console.log('********************************************************************************');
        console.log('BEGIN TEST SETUP');

        testSetup.clearAll()
            .then(testSetup.setupPlayers, done)
            .then(testSetup.setupMatches, done)
            .then(function (result) {
                testData = result;
                done();
            }, done);
    });

    describe('getQueuedMatchById', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should return a match if a queued match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(
                matchQueueDAO.getQueuedMatchById,
                [testData.queuedMatches[0].match_queue_key],
                testData.queuedMatches[0],
                done);
        });

        it('should return null if no queued match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(matchQueueDAO.getQueuedMatchById, [2000000000], done);
        });

        it('should throw an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.getQueuedMatchById, [], done);
        });

        it('should throw an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.getQueuedMatchById, ['ABC'], done);
        });
    });

    describe('queueMatch', function () {

        it('should create a new match_queue record with the given matchKey and return the queued match', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.queueMatch(testData.matches[0].match_key)
                .then(function (queuedMatch) {
                    try {
                        testValidators.expectNonNull(queuedMatch);
                        testValidators.expectValidKey(queuedMatch.match_queue_key, 'match_queue_key');
                        testValidators.expectDate(queuedMatch.queued_dtm, 'queued_dtm');
                        testValidators.expectResult(queuedMatch.match_key, testData.matches[0].match_key);
                        // OR testValidators.expectSubsetMatch(queuedMatch, {'match_key': testData.matches[0].match_key});
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should throw an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.queueMatch, [], done);
        });

        it('should throw an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.queueMatch, ['ABC'], done);
        });

        it('should throw an error if no match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.queueMatch, [2000000000], done);
        });
    });

    describe('getNextMatch', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should return a match if a pending (not started or canceled) queued match exists', function (done) {
            console.log('********************************************************************************');
            //done(new Error('!!! TEST SETUP !!!'));
            // What should this return?
            //   A match_queue record? seems like this would be enough...
            //   A match?
            //   A combined object with both properties?
            //   A joined object, match queue record with added match property?
            //   A joined object, match with added match_queue property?
            //   Both objects, wrapped in a {match: ..., queuedMatch: ...}
            // Think about use cases...
            // This func is only called from TableManager._idle
            // The only thing required is a match_id (to set currentMatch)
            // So I should keep it simple for now and just return the queue record
            testCases.expectResult(matchQueueDAO.getNextMatch, [], testData.queuedMatches[0], done);
        });

        it('should return null if no pending queued match exists', function (done) {
            Promise.all([
                matchQueueDAO.cancelMatch(testData.matches[0].match_key),
                matchQueueDAO.startMatch(testData.matches[1].match_key)
                    .then(function (result) {
                        return matchQueueDAO.finishMatch(testData.matches[1].match_key);
                    }),
                matchQueueDAO.startMatch(testData.matches[2].match_key)
            ]).then(function () {
                console.log('********************************************************************************');
                testCases.expectNoResult(matchQueueDAO.getNextMatch, [], done);
            });
        });
    });

    describe('getMatches', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should return all queued matches in a pending state (not started or canceled)', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(matchQueueDAO.getMatches, [], testData.queuedMatches, done);
        });

        it('should return null if no pending queued match exists', function (done) {
            Promise.all([
                // TODO: This should be moved to TestSetup
                // Even if it's just a proxy for the dao methods
                matchQueueDAO.cancelMatch(testData.matches[0].match_key),
                matchQueueDAO.startMatch(testData.matches[1].match_key)
                    .then(function (result) {
                        return matchQueueDAO.finishMatch(testData.matches[1].match_key);
                    }),
                matchQueueDAO.startMatch(testData.matches[2].match_key)
            ]).then(function () {
                console.log('********************************************************************************');
                testCases.expectNoResult(matchQueueDAO.getNextMatch, [], done);
            });
        });
    });

    describe('cancelMatch', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should set the canceled_dtm of the queue record for the given match to now', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.cancelMatch(testData.queuedMatches[0].match_key)
                .then(function (noresult) {
                    console.log('VERIFY TEST RESULTS');
                    return matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key)
                }, function (err) {
                    done(new Error(err));
                })
                .then(function (queuedMatch) {
                    try {
                        assert(queuedMatch != null);
                        assert(queuedMatch.canceled_dtm != null);
                        done();
                    } catch (e) {
                        done(e);
                    }
                }, function (err) {
                    var errMsg = 'FAILED TO VERIFY TEST RESULTS ' + err;
                    console.log(errMsg);
                    done(new Error(errMsg));
                });
        });

        it('should throw an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.cancelMatch, [], done);
        });

        it('should throw an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.cancelMatch, ['ABC'], done);
        });

        it('should throw an error if no queue record with the given match ID exists (match not exists OR match not queued)', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.cancelMatch, [2000000000], done);
        });

    });

    describe('delayMatch', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should set the queued_dtm of the queue record for the given match to now', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.delayMatch(testData.queuedMatches[0].match_key)
                .then(function (noresult) {
                    console.log('VERIFY TEST RESULTS');
                    return matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key)
                }, function (err) {
                    done(new Error(err));
                })
                .then(function (queuedMatch) {
                    try {
                        assert(queuedMatch != null);
                        assert(queuedMatch.queued_dtm != null);
                        // TODO
                        // assert queuedMatch.queued_dtm is greater than the test data value
                        // need to include queued_dtm in testData
                        // timeout 1s, then test?
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    var errMsg = 'FAILED TO VERIFY TEST RESULTS ' + err;
                    console.log(errMsg);
                    done(new Error(errMsg));
                });
        });

        it('should throw an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.delayMatch, [], done);
        });

        it('should throw an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.delayMatch, ['ABC'], done);
        });

        it('should throw an error if no queue record with the given match ID exists (match not exists OR match not queued)', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.delayMatch, [2000000000], done);
        });
    });

    describe('startMatch', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should set the started_dtm of the queue record for the given match to now', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.startMatch(testData.queuedMatches[0].match_key)
                .then(function (noresult) {
                    console.log('VERIFY TEST RESULTS');
                    return matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key)
                }, function (err) {
                    done(new Error(err));
                })
                .then(function (queuedMatch) {
                    try {
                        assert(queuedMatch != null);
                        assert(queuedMatch.started_dtm != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    var errMsg = 'FAILED TO VERIFY TEST RESULTS ' + err;
                    console.log(errMsg);
                    done(new Error(errMsg));
                });
        });

        it('should throw an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.startMatch, [], done);
        });

        it('should throw an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.startMatch, ['ABC'], done);
        });

        it('should throw an error if no queue record with the given match ID exists (match not exists OR match not queued)', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.startMatch, [2000000000], done);
        });
    });

    describe('finishMatch', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should set the finished_dtm of the queue record for the given match to now', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.finishMatch(testData.queuedMatches[0].match_key)
                .then(function (noresult) {
                    console.log('VERIFY TEST RESULTS');
                    return matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key)
                }, function (err) {
                    done(new Error(err));
                })
                .then(function (queuedMatch) {
                    try {
                        assert(queuedMatch != null);
                        assert(queuedMatch.completed_dtm != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    var errMsg = 'FAILED TO VERIFY TEST RESULTS ' + err;
                    console.log(errMsg);
                    done(new Error(errMsg));
                });
        });

        it('should throw an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.finishMatch, [], done);
        });

        it('should throw an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.finishMatch, ['ABC'], done);
        });

        it('should throw an error if no queue record with the given match ID exists (match not exists OR match not queued)', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueDAO.finishMatch, [2000000000], done);
        });
    });

});
