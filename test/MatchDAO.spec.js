var assert = require("assert");
var testSetup = require('../test/TestSetup');
var matchDAO = require('../server/daos/MatchDAO');

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
        }],
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
    ]
};

describe('MatchDAO', function () {

    beforeEach(function (done) {
        console.log('********************************************************************************');
        console.log('BEGIN TEST SETUP');
        testSetup.clearAll().then(
            function (result) {
                testSetup.setupPlayers(testData.players).then(
                    function (results) {
                        console.log('ADDED PLAYERS: ' + results);
                        for (var i = 0; i < results.length; i++) {
                            testData.players[i].player_key = results[i];
                        }
                        testSetup.setupMatches(testData.matches).then(
                            function (results) {
                                console.log('ADDED MATCHES: ' + results);
                                for (var i = 0; i < results.length; i++) {
                                    testData.matches[i].match_key = results[i];
                                }
                                console.log('TEST SETUP COMPLETE');
                                console.log('********************************************************************************');
                                done();
                            },
                            function (err) {
                                var errMsg = 'TEST SETUP FAILED: ' + err;
                                console.log(errMsg);
                                console.log('********************************************************************************');
                                done(errMsg);
                            });
                    },
                    function (err) {
                        var errMsg = 'TEST SETUP FAILED: ' + err;
                        console.log(errMsg);
                        console.log('********************************************************************************');
                        done(errMsg);
                    });
            }, function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                console.log('********************************************************************************');
                done(errMsg);
            });
    });

    describe('getMatchById', function () {

        it('should return a match if a match with the given ID exists', function (done) {
            matchDAO.getMatchById(testData.players[0].player_key)
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

        it('should return null if no match with the given ID exist', function (done) {
            matchDAO.getMatchById(2000000000)
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
            matchDAO.getMatchById()
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
            matchDAO.getMatchById('ABC')
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

    describe('createMatch', function () {

        it('should create a new match with the given match_type and return the match ID', function (done) {
            matchDAO.createMatch('SINGLES')
                .then(function (matchKey) {
                    try {
                        assert(matchKey != null);
                        assert(matchKey > 0);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if the given match_type is null', function (done) {
            matchDAO.createMatch()
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

        it('should return an error if the given match_type is invalid', function (done) {
            matchDAO.createMatch('BEER PONG')
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

    describe('getMatchPlayers', function () {

        it('should return all players linked to the given match, split into multiple arrays by team', function (done) {
            done(new Error('NOT IMPLEMENTED'));
        });

        it('should return an empty object if no players are linked to the given match', function (done) {
            done(new Error('NOT IMPLEMENTED'));
        });

        it('should return an error if the given ID is null', function (done) {
            matchDAO.getMatchById()
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
            matchDAO.getMatchById('ABC')
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

    describe('createMatchPlayer', function () {

        it('should link the given player to the given match with the given team', function (done) {
            matchDAO.createMatchPlayer(testData.matches[0].match_key, testData.players[0].player_key, 'CHALLENGER')
                .then(function (matchPlayerKey) {
                    try {
                        assert(matchPlayerKey != null);
                        assert(matchPlayerKey > 0);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if the given matchKey does not exist', function (done) {
            matchDAO.createMatchPlayer(2000000000, testData.players[0].player_key, 'CHALLENGER')
                .then(function (matchPlayerKey) {
                    done(new Error("Failed to fail " + matchPlayerKey));
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

        it('should return an error if the given playerKey does not exist', function (done) {
            matchDAO.createMatchPlayer(testData.matches[0].match_key, 2000000000, 'CHALLENGER')
                .then(function (matchPlayer) {
                    done(new Error("Failed to fail " + matchPlayer));
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

        it('should return an error if the given match already has the max allowed players for it\'s match_type', function (done) {
            done(new Error('NOT IMPLEMENTED'));
        });

    });
});
