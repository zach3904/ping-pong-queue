/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var Promise = require('promise');
var testSetup = require('../TestSetup');
var testValidators = require('../TestValidators');
var testCases = require('../TestCases');
var matchQueueDAO = require('../../server/daos/MatchQueueDAO');
var matchQueueResource = require('../../server/resources/MatchQueueResource');

var testData;

describe('MatchQueueResource', function () {

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

        it('should return a queued match if one with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(
                matchQueueResource.getQueuedMatchById,
                [testData.queuedMatches[0].match_queue_key],
                testData.queuedMatches[0],
                done);
        });

        it('should return null if no queued match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(matchQueueResource.getQueuedMatchById, [2000000000], done);
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueResource.getQueuedMatchById, [null], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueResource.getQueuedMatchById, ['ABC'], done);
        });

    });

    describe('queueMatch', function () {

        it('should create a new match_queue record with the given matchKey and return the queued match', function (done) {
            console.log('********************************************************************************');
            matchQueueResource.queueMatch(testData.matches[0].match_key)
                .then(function (queuedMatch) {
                    try {
                        testValidators.expectNonNull(queuedMatch);
                        testValidators.expectValidKey(queuedMatch.match_queue_key);
                        testValidators.expectDate(queuedMatch.queued_dtm);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should throw an error if no match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueResource.queueMatch, [2000000000], done);
        });

        it('should throw an error if the given match ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueResource.queueMatch, [null], done);
        });

        it('should throw an error if the given match ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchQueueResource.queueMatch, ['ABC'], done);
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

        it('should return the oldest pending (not started or canceled) queued match if one exists', function (done) {
            console.log('********************************************************************************');
            matchQueueResource.getNextMatch()
                .then(function (match) {
                    try {
                        assert(match != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return null if no pending (not started or canceled) queued matches exist', function (done) {
            console.log('********************************************************************************');
            Promise.all([
                matchQueueDAO.cancelMatch(testData.matches[0].match_key),
                matchQueueDAO.startMatch(testData.matches[1].match_key)
                    .then(function (result) {
                        return matchQueueDAO.finishMatch(testData.matches[1].match_key);
                    }),
                matchQueueDAO.startMatch(testData.matches[2].match_key)
            ]).then(function () {
                console.log('********************************************************************************');
                testCases.expectNoResult(matchQueueResource.getNextMatch, [], done);
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

        it('should return all matches in a pending state (not started or canceled)', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(
                matchQueueResource.getMatches,
                [],
                testData.queuedMatches,
                done);
        });

        it('should return null if no pending (not started or canceled) queued matches exist', function (done) {
            console.log('********************************************************************************');
            Promise.all([
                matchQueueDAO.cancelMatch(testData.matches[0].match_key),
                matchQueueDAO.startMatch(testData.matches[1].match_key)
                    .then(function (result) {
                        return matchQueueDAO.finishMatch(testData.matches[1].match_key);
                    }),
                matchQueueDAO.startMatch(testData.matches[2].match_key)
            ]).then(function () {
                console.log('********************************************************************************');
                testCases.expectNoResult(matchQueueResource.getMatches, [], done);
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
            matchQueueResource.cancelMatch(testData.queuedMatches[0].match_key)
                .then(function (noresult) {
                    console.log('FETCH RESULT');
                    return matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key);
                }, done)
                .then(function (result) {
                    try {
                        testValidators.expectNonNull(result);
                        testValidators.expectDate(result.canceled_dtm, 'canceled_dtm');
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, done);
        });

        it('should return an error if the queued record for the given match already has a canceled_dtm', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.cancelMatch(testData.queuedMatches[0].match_key)
                .then(function (result) {
                    // FAILS BECAUSE THERE IS NO MATCH STATE CHECK IN RESOURCE - TEST IS ACCURATE
                    testCases.expectError(matchQueueResource.cancelMatch, [testData.queuedMatches[0].match_key], done);
                });
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
            var originalQueuedDtm = testData.queuedMatches[0].queued_dtm;
            matchQueueResource.delayMatch(testData.queuedMatches[0].match_key)
                .then(function (noresult) {
                    console.log('FETCH RESULT');
                    return matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key);
                }, done)
                .then(function (result) {
                    try {
                        testValidators.expectNonNull(result);
                        testValidators.expectDate(result.queued_dtm, 'queued_dtm');
                        testValidators.expectGreaterThan(result.queued_dtm, originalQueuedDtm, 'queued_dtm');
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, done);
        });

    });

    // THE FOLLOWING TESTS INVOLVE TABLE STATE, WHICH IS DEPENDANT ON TIME, AND REQUIRE A MOCKED CLOCK
    // http://stackoverflow.com/questions/17446064/how-can-i-simulate-the-passing-of-time-in-mocha-tests-so-that-settimeout-callbac

    describe('getTableState', function () {

        it('should return a valid table state with all required properties', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });

    });

    describe('startNext', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData)
                .then(function (result) {
                    testData.tableState = matchQueueResource.initTableManager();
                    testData = result;
                    done();
                }, done);
        });

        // matchQueueResource.startNext
        // -> TableManager.start which clears the timer
        // ---> TableManager._start which calls the startCB callback
        // -----> matchQueueResource.matchStartHandler
        // -------> matchQueueDAO.startMatch
        // ---> and then sets the state (MATCH_IN_PROGRESS) and timer (DEFAULT_MATCH_TIME)

        it('should cause the table state to transition from MATCH_PREP to MATCH_IN_PROGRESS', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
            //matchQueueResource.startNext()
            //    .then(function (tableState) {
            //        try {
            //            assert(tableState.state == 'MATCH_IN_PROGRESS', 'Unexpected table state: ' + tableState.state);
            //            assert(tableState.currentMatch == testData.matches[0].match_key, 'Unexpected currentMatch: ' + tableState.currentMatch);
            //            //assert(matchById.started_dtm != null, 'Expected non-null started_dtm, found null');
            //        } catch (e) {
            //            done(e);
            //            return;
            //        }
            //        done();
            //    });
        });

        it('should set the currentMatch to the match ID of the next pending queued match');

        // gray box: it('should call TableManager.start
        // gray box: it('should call MatchQueueResource.matchStartHandler');
        // gray box: it('should call MatchQueueDAO.startMatch');
        // gray box: it('should set a timeout that calls _finish when complete');

        it('should throw an error if the table manager is not in MATCH_PREP state', function (done) {
            done(new Error('Test not implemented'));
        });

        it('should set the started_dtm of the next pending queued match to now', function (done) {
            done(new Error('Test not implemented'));
        });

        it('should throw an error if there are no queued matches', function (done) {
            done(new Error('Test not implemented'));
        });

    });

    describe('finishCurrent', function () {

        it('should cause the table state to transition from MATCH_IN_PROGRESS to IDLE', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });

    });

    describe('addTimeToCurrent', function () {

        it('should add the given duration (ms) to the table timer', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });

    });

    describe('restartCurrent cause the table timer to reset to the DEFAULT_MATCH_TIME', function () {

        it('should ', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });

    });

    describe('cancelCurrent should cause the table state to transition from MATCH_IN_PROGRESS to IDLE', function () {

        it('should ', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });

    });

});
