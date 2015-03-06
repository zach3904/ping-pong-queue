var assert = require("assert");
//var should = require("should");
var testSetup = require('../test/TestSetup');
var playerDAO = require('../server/daos/PlayerDAO');

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

describe('PlayerDAO', function () {

    beforeEach(function (done) {
        console.log('********************************************************************************');
        console.log('BEGIN TEST SETUP');
        testSetup.clearAll()
            .then(function (result) {
                return testSetup.setupPlayers(testData.players);
            }, function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                console.log('********************************************************************************');
                done(new Error(errMsg));
            })
            .then(function (results) {
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
                done(new Error(errMsg));
            });
    });

    describe('getPlayerById', function () {

        it('should return a player if a players with the given ID exists', function (done) {
            playerDAO.getPlayerById(testData.players[0].player_key)
                .then(function (player) {
                    //player.should.not.be.null;
                    try {
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

        it('should return null if no players with the given ID exists', function (done) {
            playerDAO.getPlayerById('2000000000')
                .then(function (player) {
                    try {
                        assert(player == null);
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
            playerDAO.getPlayerById()
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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
            playerDAO.getPlayerById('ABC')
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

    describe('getPlayerByAny', function () {

        it('should return the player with a matching name', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'name',
                data_type: 'text'
            }], [testData.players[0].name])
                .then(function (player) {
                    try {
                        assert(player != null);
                        assert(player.name == testData.players[0].name);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return the player with a matching hipchat_name', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'hipchat_name',
                data_type: 'text'
            }], [testData.players[0].hipchat_name])
                .then(function (player) {
                    try {
                        assert(player != null);
                        assert(player.hipchat_name == testData.players[0].hipchat_name);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return the player with a matching email_address', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'email_address',
                data_type: 'text'
            }], [testData.players[0].email_address])
                .then(function (player) {
                    try {
                        assert(player != null);
                        assert(player.email_address == testData.players[0].email_address);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done()
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return null if no players are found', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'name',
                data_type: 'text'
            }, {
                column_name: 'hipchat_name',
                data_type: 'text'
            }, {
                column_name: 'email_address',
                data_type: 'text'
            }], [
                "VALUE_SHOULD_NOT_EXIST",
                "VALUE_SHOULD_NOT_EXIST",
                "VALUE_SHOULD_NOT_EXIST"
            ])
                .then(function (player) {
                    try {
                        assert(player == null);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if player request criteria is null', function (done) {
            playerDAO.getPlayerByAny()
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

        it('should return an error if player request criteria is empty', function (done) {
            playerDAO.getPlayerByAny([])
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

        it('should return an error if player request params is null', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'name',
                data_type: 'text'
            }], null)
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

        it('should return an error if player request params is empty', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'name',
                data_type: 'text'
            }], [])
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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
        it('should return an error if player request contains unknown criteria (causes a db error)', function (done) {
            playerDAO.getPlayerByAny([{
                column_name: 'blood_type',
                data_type: 'int'
            }], [12])
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

    describe('searchPlayers', function () {

        it('should return all players with a matching name', function (done) {
            playerDAO.searchPlayers(testData.players[0].name.substr(1, 4))
                .then(function (matchedPlayers) {
                    try {
                        assert(matchedPlayers != null);
                        assert(matchedPlayers.length > 0);
                        assert(matchedPlayers[0].player_key == testData.players[0].player_key);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return all players with a matching hipchat_name', function (done) {
            playerDAO.searchPlayers(testData.players[0].hipchat_name.substr(1, 4))
                .then(function (matchedPlayers) {
                    try {
                        assert(matchedPlayers != null);
                        assert(matchedPlayers.length > 0);
                        assert(matchedPlayers[0].player_key == testData.players[0].player_key);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return all players with a matching email_address', function (done) {
            playerDAO.searchPlayers(testData.players[0].email_address.substr(1, 4))
                .then(function (matchedPlayers) {
                    try {
                        assert(matchedPlayers != null);
                        assert(matchedPlayers.length > 0);
                        assert(matchedPlayers[0].player_key == testData.players[0].player_key);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an empty array if query does not match any player attributes', function (done) {
            playerDAO.searchPlayers("VALUE_SHOULD_NOT_EXIST")
                .then(function (matchedPlayers) {
                    try {
                        assert(matchedPlayers != null);
                        assert(matchedPlayers instanceof Array);
                        assert(matchedPlayers.length == 0);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if player request query is empty', function (done) {
            playerDAO.searchPlayers()
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

        it('should return an error if player request query is invalid', function (done) {
            playerDAO.searchPlayers(12)
                .then(function (player) {
                    done(new Error("Failed to fail " + player));
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

    describe('addPlayer', function () {

        it('should insert a new player with the given name', function (done) {
            playerDAO.addPlayer({
                //name: testData.players[0].name
                name: "ADDED PLAYER " + Date.now()
            })
                .then(function (savedPlayerId) {
                    try {
                        assert(savedPlayerId != null);
                        assert(savedPlayerId > 0);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if the player name is null', function (done) {
            playerDAO.addPlayer({
                hipchat_name: "@VALID_HIPCHAT_NAME"
            })
                .then(function (savedPlayerId) {
                    done(new Error("Failed to fail " + savedPlayerId));
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

        it('should return an error if the player name is empty', function (done) {
            playerDAO.addPlayer({
                name: "",
                hipchat_name: "@VALID_HIPCHAT_NAME"
            })
                .then(function (savedPlayerId) {
                    done(new Error("Failed to fail " + savedPlayerId));
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

    describe('updatePlayer', function () {

        it('should update the player with the given ID to reflect the given attribute values', function (done) {
            playerDAO.updatePlayer({
                player_key: testData.players[0].player_key,
                name: "UPDATED_NAME",
                hipchat_name: "UPDATED_HIPCHAT_NAME",
                email_address: "UPDATED_EMAIL_ADDRESS",
                skill_level: "BEGINNER",
                tagline: "UPDATED_TAGLINE"
            })
                .then(function (updatedPlayer) {
                    try {
                        assert(updatedPlayer != null);
                        assert(updatedPlayer.player_key == testData.players[0].player_key);
                        assert(updatedPlayer.name == "UPDATED_NAME");
                        assert(updatedPlayer.hipchat_name == "UPDATED_HIPCHAT_NAME");
                        assert(updatedPlayer.email_address == "UPDATED_EMAIL_ADDRESS");
                        assert(updatedPlayer.skill_level == "BEGINNER");
                        assert(updatedPlayer.tagline == "UPDATED_TAGLINE");
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if the given player ID is null', function (done) {
            playerDAO.updatePlayer({
                hipchat_name: "@VALID_HIPCHAT_NAME"
            })
                .then(function (updatedPlayer) {
                    done(new Error("Failed to fail " + updatedPlayer));
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

        it('should return an error if the player name is null', function (done) {
            playerDAO.updatePlayer({
                player_key: testData.players[0].player_key,
                hipchat_name: "@VALID_HIPCHAT_NAME"
            })
                .then(function (updatedPlayer) {
                    done(new Error("Failed to fail " + updatedPlayer));
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

        it('should return an error if the player name is empty', function (done) {
            playerDAO.updatePlayer({
                player_key: testData.players[0].player_key,
                name: ""
            })
                .then(function (updatedPlayer) {
                    done(new Error("Failed to fail " + updatedPlayer));
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
