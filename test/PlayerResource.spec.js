var assert = require("assert");
//var should = require("should");
var testSetup = require('../test/TestSetup');
var playerResource = require('../server/resources/PlayerResource');

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
        }]
};

describe('PlayerResource', function () {

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
            }, function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                console.log('********************************************************************************');
                done(errMsg);
            });
    });

    describe('getPlayerById', function () {
        it('should return a player if a player with the given ID exists', function (done) {
            // Mock and spy on playerDAO.getPlayerById ?
            // No, gray box testing is not needed.  Doing blackbox at each level.
            playerResource.getPlayerById(testData.players[0].player_key)
                .then(function (player) {
                    try {
                        //expect('playerDAO.getPlayerById').toHaveBeenCalled();
                        assert(player != null);
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

    describe('getPlayerByAny', function () {
        it ('should compose a list of criteria (player attributes) and params (player attribute values)', function (done) {
            playerResource.getPlayerByAny({name: testData.players[0].name})
                .then(function (player) {
                    try {
                        assert(player != null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                })
        })
    });

    describe('searchPlayers', function () {
        // Black-box: Nothing to test
        // Gray-box: Just test that it calls the DAO
    });

    describe('addPlayer', function () {
        // Black-box: Nothing to test
        // Gray-box: Just test that it calls the DAO
    });

    describe('updatePlayer', function () {
        // Black-box: Nothing to test
        // Gray-box: Just test that it calls the DAO
    });

    describe('resolvePlayers', function () {
        it ('should return an array of players with size equal to the size of the given player request array', function (done) {
            var playersRequest = [{name: testData.players[0].name}, {name: testData.players[1].name}];
            playerResource.resolvePlayers(playersRequest)
                .then(function (players) {
                    try {
                        assert(players != null);
                        assert(players instanceof Array);
                        assert(players.length == playersRequest.length);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });
        it ('should return an error if more than one player request resolves to the same player', function (done) {
            playerResource.resolvePlayers([{name: 'molsen'}, {'hipchat_name': '@molsen'}])
                .then(function (players) {
                    done('Failed to fail ' + players);
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
        it ('should return an error if any player request does not contain at least one unique identifier', function (done) {
            playerResource.resolvePlayers([{tagline: 'Tag line is not a unique identifier (nor is it a searchable field), so this should fail'}])
                .then(function (players) {
                    done('Failed to fail ' + players);
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
        it ('should return an error if creating a player fails', function (done) {
            playerResource.resolvePlayers([{name: 'PLAYER NAME THAT DOES NOT EXIST', skill_level: 'INVALID SKILL LEVEL'}])
                .then(function (players) {
                    done('Failed to fail ' + players);
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
