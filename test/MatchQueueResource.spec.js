var assert = require("assert");
var testSetup = require('../test/TestSetup');
var matchQueueResource = require('../server/resources/MatchQueueResource');

var testData = {
    players: [
        {
            player_key: null,
            name: 'molsen',
            hipchat_name: '@molsen',
            email_address: 'matthewo@porch.com',
            skill_level: 'INTERMEDIATE',
            'tagline': 'YeaH BuddY!'
        }, {
            player_key: null,
            name: 'TheZACH (admin)',
            hipchat_name: '@ZacharyRichards',
            email_address: 'zachr@porch.com',
            skill_level: 'PRO STATUS',
            'tagline': null
        }
    ],
    matches: [
        {
            match_key: null,
            match_type: 'SINGLES'
        },
        {
            match_key: null,
            match_type: 'DOUBLES'
        },
        {
            match_key: null,
            match_type: 'ROUNDROBIN'
        }
    ],
    queuedMatches: [
        //{
        //    match_queue_key: null,
        //    match_key: null
        //    //queued_dtm: null,
        //    //started_dtm: null,
        //    //completed_dtm: null,
        //    //canceled_dtm: null
        //}
    ]
};

describe('MatchQueueResource', function () {

    beforeEach(function (done) {
        console.log('');
        console.log('********************************************************************************');
        console.log('BEGIN TEST SETUP');
        // TODO
        // Clear test data between tests
        // Most of it gets overwritten
        // The queuedMatches don't because they are appended to an array
        // Need a uniform way of handling this
        // Load defaults at the beginning of each test?
        testData.queuedMatches = [];
        testSetup.clearAll()
            .then(function (result) {
                return testSetup.setupPlayers(testData.players);
            }, function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.error(errMsg);
                done(new Error(errMsg));
            }).then(function (results) {
                console.log('ADDED PLAYERS: ' + results);
                for (var i = 0; i < results.length; i++) {
                    testData.players[i].player_key = results[i];
                }
                return testSetup.setupMatches(testData.matches);
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.error(errMsg);
                done(new Error(errMsg));
            }).then(function (results) {
                console.log('ADDED MATCHES: ' + results);
                for (var i = 0; i < results.length; i++) {
                    testData.matches[i].match_key = results[i];
                }
                //console.log('TEST SETUP COMPLETE');
                done();
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.error(errMsg);
                done(new Error(errMsg));
            });
    });

    describe('getQueuedMatchById', function () {

        beforeEach(function (done) {
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
                    }
                    console.log('TEST SETUP COMPLETE');
                    done();
                },
                function (err) {
                    var errMsg = 'TEST SETUP FAILED: ' + err;
                    console.error(errMsg);
                    done(new Error(errMsg));
                });
        });

        it('should return a queued match if one with the given ID exists', function (done) {
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
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
                    }
                    console.log('TEST SETUP COMPLETE');
                    done();
                },
                function (err) {
                    var errMsg = 'TEST SETUP FAILED: ' + err;
                    console.error(errMsg);
                    done(new Error(errMsg));
                });
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
            done(new Error('Test not implemented'));
        });
    });

    describe('cancelMatch', function () {
        it('should set the canceled_dtm of the queue record for the given match to now', function (done) {
            done(new Error('Test not implemented'));
        });
    });

    describe('delayMatch', function () {
        it('should set the queued_dtm of the queue record for the given match to now', function (done) {
            done(new Error('Test not implemented'));
        });
    });

    describe('getTableState', function () {
        it('should return a valid table state with all required properties', function (done) {
            done(new Error('Test not implemented'));
        });
    });

    describe('startNext', function () {
        it('should cause the table state to transition from MATCH_PREP to MATCH_IN_PROGRESS', function (done) {
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
            done(new Error('Test not implemented'));
        });
    });

    describe('addTimeToCurrent', function () {
        it('should add the given duration (ms) to the table timer', function (done) {
            done(new Error('Test not implemented'));
        });
    });

    describe('restartCurrent cause the table timer to reset to the DEFAULT_MATCH_TIME', function () {
        it('should ', function (done) {
            done(new Error('Test not implemented'));
        });
    });

    describe('cancelCurrent should cause the table state to transition from MATCH_IN_PROGRESS to IDLE', function () {
        it('should ', function (done) {
            done(new Error('Test not implemented'));
        });
    });

});
