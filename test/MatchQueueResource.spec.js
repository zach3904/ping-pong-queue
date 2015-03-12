var assert = require("assert");
var testSetup = require('../test/TestSetup');
var matchQueueResource = require('../server/resources/MatchQueueResource');

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
            matchQueueResource.getQueuedMatchById(testData.queuedMatches[0].match_queue_key)
                .then(function (queuedMatch) {
                    try {
                        assert(queuedMatch != null);
                        assert(queuedMatch.match_queue_key == testData.queuedMatches[0].match_queue_key);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        //it('should return null if the given ID does not exist');
        //it('should return an error if the given ID is null');
        //it('should return an error if the given ID is invalid');
    });

    describe('queueMatch', function () {

        it('should create a new match_queue record with the given matchKey and return the matchQueueKey', function (done) {
            console.log('********************************************************************************');
            matchQueueResource.queueMatch(testData.matches[0].match_key)
                .then(function (matchQueueKey) {
                    try {
                        assert(matchQueueKey != null);
                        assert(matchQueueKey > 0);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        //it('should return an error if the given match ID does not exist');
        //it('should return an error if the given match ID is null');
        //it('should return an error if the given match ID is invalid');
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

        //it('should return null if no pending (not started or canceled) matches exist');
    });

    describe('getMatches', function () {
        it('should return all matches in a pending state (not started or canceled)', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });
    });

    describe('cancelMatch', function () {
        it('should set the canceled_dtm of the queue record for the given match to now', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });
    });

    describe('delayMatch', function () {
        it('should set the queued_dtm of the queue record for the given match to now', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });
    });

    describe('getTableState', function () {
        it('should return a valid table state with all required properties', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });
    });

    describe('startNext', function () {
        it('should cause the table state to transition from MATCH_PREP to MATCH_IN_PROGRESS', function (done) {
            console.log('********************************************************************************');
            done(new Error('Test not implemented'));
        });
        // gray box: it('should call TableManager.start
        // gray box: it('should call MatchQueueResource.matchStartHandler');
        // gray box: it('should call MatchQueueDAO.startMatch');
        // black box: it('should set the started_dtm of the next queued match to now');
        // can I test
        // it('should set a timeout that calls _finish when complete');
        it('should return an error if the table manager is not in MATCH_PREP state');
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
