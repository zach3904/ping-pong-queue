'use strict';

var Promise = require('promise');

var db = require('../server/db.js');
var TestData = require('../test/TestData');
var playerDAO = require('../server/daos/PlayerDAO');
var singlePlayerDAO = require('../server/daos/SinglePlayerDAO');
var matchDAO = require('../server/daos/MatchDAO');
var matchPlayerDAO = require('../server/daos/MatchPlayerDAO');
var matchQueueDAO = require('../server/daos/MatchQueueDAO');
var challengeDAO = require('../server/daos/ChallengeDAO');
var outcomeDAO = require('../server/daos/OutcomeDAO');

module.exports = {

    name: 'testSetup',

    clearAll: function () {
        console.log('CLEAR TEST DB');
        return new Promise(function (resolve, reject) {
            db.query('SELECT truncate_ping_pong_tables();',
                [], function (err, result) {
                    if (err) {
                        console.log("ERROR Failed to clear test db " + err);
                        reject(new Error("ERROR Failed to clear test db " + err));
                        return;
                    }
                    console.log('TEST DB CLEARED');
                    resolve(new TestData());
                });
        });
    },

    setupPlayers: function (testData) {
        var playerRequests = testData.getPlayerRequests();
        var playerPromises = [];
        for (var i = 0; i < playerRequests.length; i++) {
            playerPromises.push(playerDAO.addPlayer(playerRequests[i]));
        }
        return Promise.all(playerPromises)
            .then(function (results) {
                console.log('ADDED PLAYERS: ' + JSON.stringify(results));
                testData.setPlayers(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupSinglePlayers: function (testData) {
        var singlePlayerRequests = testData.getSinglePlayerRequests();
        var singlePlayerPromises = [];
        for (var i = 0; i < singlePlayerRequests.length; i++) {
            singlePlayerPromises.push(singlePlayerDAO.addSinglePlayer(singlePlayerRequests[i]));
        }
        return Promise.all(singlePlayerPromises)
            .then(function (results) {
                console.log('ADDED SINGLE PLAYERS: ' + JSON.stringify(results));
                testData.setSinglePlayers(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupMatches: function (testData) {
        var matchRequests = testData.getMatchRequests();
        var matchPromises = [];
        for (var i = 0; i < matchRequests.length; i++) {
            matchPromises.push(matchDAO.createMatch(matchRequests[i].match_type));
        }
        return Promise.all(matchPromises)
            .then(function (results) {
                console.log('ADDED MATCHES: ' + JSON.stringify(results));
                testData.setMatches(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupMatchPlayers: function (testData) {
        var matchPlayerRequests = testData.getMatchPlayerRequests();
        var matchPlayerPromises = [];
        for (var i = 0; i < matchPlayerRequests.length; i++) {
            matchPlayerPromises.push(
                matchPlayerDAO.createMatchPlayer(
                    matchPlayerRequests[i].match_key,
                    matchPlayerRequests[i].player_key,
                    matchPlayerRequests[i].team
                )
            );
        }
        return Promise.all(matchPlayerPromises)
            .then(function (results) {
                console.log('ADDED MATCH PLAYERS: ' + JSON.stringify(results));
                testData.setMatchPlayers(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupQueuedMatches: function (testData) {
        var matchQueueRequests = testData.getMatchQueueRequests();
        var queuedMatchPromises = [];
        for (var i = 0; i < matchQueueRequests.length; i++) {
            queuedMatchPromises.push(matchQueueDAO.queueMatch(matchQueueRequests[i].match_key));
        }
        return Promise.all(queuedMatchPromises)
            .then(function (results) {
                console.log('QUEUED MATCHES: ' + JSON.stringify(results));
                testData.setQueuedMatches(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupChallenges: function (testData) {
        var challengeRequests = testData.getChallengeRequests();
        var challengePromises = [];
        for (var i = 0; i < challengeRequests.length; i++) {
            challengePromises.push(challengeDAO.createChallenge(challengeRequests[i]));
        }
        return Promise.all(challengePromises)
            .then(function (results) {
                console.log('ADDED CHALLENGES: ' + JSON.stringify(results));
                testData.setChallenges(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupOutcomes: function (testData) {
        var outcomeRequests = testData.getOutcomeRequests();
        var outcomePromises = [];
        for (var i = 0; i < outcomeRequests.length; i++) {
            outcomePromises.push(outcomeDAO.createOutcome(outcomeRequests[i]));
        }
        return Promise.all(outcomePromises)
            .then(function (results) {
                console.log('ADDED OUTCOMES: ' + JSON.stringify(results));
                testData.setOutcomes(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    }
};