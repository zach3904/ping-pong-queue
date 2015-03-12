var assert = require("assert");
var testSetup = require('../test/TestSetup');
var matchDAO = require('../server/daos/MatchDAO');

var testData;

describe('MatchDAO', function () {

    beforeEach(function (done) {
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

    describe('getMatchById', function () {

        it('should return a match if a match with the given ID exists', function (done) {
            matchDAO.getMatchById(testData.matches[0].match_key)
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

        // TODO create addMatchPlayer function in MatchResource
        // call the resource method from addMatch instead of the dao method
        // move this test to MatchResourceTest
        it('should return an error if the given match already has the max allowed players for it\'s match_type', function (done) {
            done(new Error('NOT IMPLEMENTED'));
        });

    });
});
