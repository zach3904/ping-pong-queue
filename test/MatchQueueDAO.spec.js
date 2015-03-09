var assert = require("assert");
var Promise = require("promise");
var testSetup = require('../test/TestSetup');
var matchQueueDAO = require('../server/daos/MatchQueueDAO');

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

describe('MatchQueueDAO', function () {

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
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
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

        it('should return a match if a queued match if the given ID exists', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.getQueuedMatchById(testData.queuedMatches[0].match_queue_key)
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

        it('should return null if no queued match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.getQueuedMatchById(2000000000)
                .then(function (match) {
                    try {
                        assert(match == null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.getQueuedMatchById()
                .then(function (match) {
                    done(new Error("Failed to fail " + match));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.getQueuedMatchById('ABC')
                .then(function (match) {
                    done(new Error("Failed to fail " + match));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });
    });

    describe('queueMatch', function () {

        it('should create a new match_queue record with the given matchKey and return the matchQueueKey', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.queueMatch(testData.matches[0].match_key)
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

        it('should return an error if the given matchKey is null', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.queueMatch()
                .then(function (matchQueueKey) {
                    done(new Error("Failed to fail " + matchQueueKey));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        it('should return an error if the given matchKey is invalid', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.queueMatch('BEER PONG')
                .then(function (matchKey) {
                    done(new Error("Failed to fail " + matchKey));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });
    });

    describe('getNextMatch', function () {

        beforeEach(function (done) {
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
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

        it('should return a match if a pending (not started or canceled) queued match exists', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.getNextMatch()
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

        it('should return null if no pending queued match exists', function (done) {
            Promise.all([
                matchQueueDAO.cancelMatch(testData.matches[0].match_key),
                matchQueueDAO.cancelMatch(testData.matches[1].match_key),
                matchQueueDAO.startMatch(testData.matches[2].match_key)
                    .then(function (result) {
                        return matchQueueDAO.finishMatch(testData.matches[2].match_key);
                    })
            ]).then(function () {
                console.log('********************************************************************************');
                matchQueueDAO.getNextMatch()
                    .then(function (queuedMatch) {
                        try {
                            assert(queuedMatch == null);
                        } catch (e) {
                            done(e);
                            return;
                        }
                        done();
                    }, function (err) {
                        done(new Error(err));
                    });
            });
        });
    });

    describe('getMatches', function () {

        beforeEach(function (done) {
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
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

        it('should return all queued matches in a pending state (not started or canceled)', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.getMatches()
                .then(function (queuedMatches) {
                    try {
                        assert(queuedMatches != null);
                        assert(queuedMatches.length == testData.queuedMatches.length);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
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
                matchQueueDAO.getMatches()
                    .then(function (queuedMatch) {
                        try {
                            assert(queuedMatch == null);
                        } catch (e) {
                            done(e);
                            return;
                        }
                        done();
                    }, function (err) {
                        done(new Error(err));
                    });
            });
        });
    });

    describe('cancelMatch', function () {

        beforeEach(function (done) {
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
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

        it('should return an error if the given match does not exist', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.cancelMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        it('should return an error if the queue record for the given match does not exist (match not queued)', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.cancelMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        // this should be enforced at the resource level
        //it('should return an error if the queued record for the given match already has a canceled_dtm', function (done) {
        //    console.log('********************************************************************************');
        //    matchQueueDAO.cancelMatch()
        //        .then(function () {
        //            done(new Error("Failed to fail"));
        //        }, function (err) {
        //            try {
        //                assert(err != null);
        //            } catch (e) {
        //                done(e);
        //                return;
        //            }
        //            done();
        //        });
        //});
    });

    describe('delayMatch', function () {

        beforeEach(function (done) {
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
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
                        // timeout 1s, then test
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

        it('should return an error if the given match does not exist', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.delayMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        it('should return an error if the queue record for the given match does not exist (match not queued)', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.delayMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });
    });

    describe('startMatch', function () {

        beforeEach(function (done) {
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
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

        it('should return an error if the given match does not exist', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.startMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        it('should return an error if the queue record for the given match does not exist (match not queued)', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.startMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });
    });

    describe('finishMatch', function () {

        beforeEach(function (done) {
            //console.log('********************************************************************************');
            //console.log('BEGIN TEST SETUP');
            testSetup.setupQueuedMatches(testData.matches)
                .then(function (results) {
                    console.log('MATCH QUEUE IDS: ' + results);
                    for (var i = 0; i < results.length; i++) {
                        testData.queuedMatches.push({
                            match_queue_key: results[i],
                            match_key: testData.matches[i].match_key
                        });
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

        it('should return an error if the given match does not exist', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.finishMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });

        it('should return an error if the queue record for the given match does not exist (match not queued)', function (done) {
            console.log('********************************************************************************');
            matchQueueDAO.finishMatch()
                .then(function () {
                    done(new Error("Failed to fail"));
                }, function (err) {
                    try {
                        assert(err != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });
    });

});
