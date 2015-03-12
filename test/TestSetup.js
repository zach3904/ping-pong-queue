'use strict';

var Promise = require('promise');

var db = require('../server/db.js');
var TestData = require('../test/TestData');
var playerDAO = require('../server/daos/PlayerDAO');
var singlePlayerDAO = require('../server/daos/SinglePlayerDAO');
var matchDAO = require('../server/daos/MatchDAO');
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
                        reject("ERROR Failed to clear test db " + err);
                        return;
                    }
                    console.log('TEST DB CLEARED');
                    resolve(new TestData());
                });
        });
    },

    setupPlayers: function (testData) {
        testData.loadPlayers();
        var playerPromises = [];
        for (var i = 0; i < testData.players.length; i++) {
            playerPromises.push(playerDAO.addPlayer(testData.players[i]));
        }
        return Promise.all(playerPromises)
            .then(function (results) {
                console.log('ADDED PLAYERS: ' + results);
                testData.storePlayerKeys(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupSinglePlayers: function (testData) {
        testData.loadSinglePlayers();
        var singlePlayerPromises = [];
        for (var i = 0; i < testData.singlePlayers.length; i++) {
            singlePlayerPromises.push(singlePlayerDAO.addSinglePlayer(testData.singlePlayers[i]));
        }
        return Promise.all(singlePlayerPromises)
            .then(function (results) {
                console.log('ADDED SINGLE PLAYERS: ' + results);
                testData.storeSinglePlayerKeys(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupMatches: function (testData) {
        testData.loadMatches();
        var matchPromises = [];
        for (var i = 0; i < testData.matches.length; i++) {
            matchPromises.push(matchDAO.createMatch(testData.matches[i].match_type));
        }
        return Promise.all(matchPromises)
            .then(function (results) {
                console.log('ADDED MATCHES: ' + results);
                testData.storeMatchKeys(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupQueuedMatches: function (testData) {
        testData.loadQueuedMatches();
        var queuedMatchPromises = [];
        for (var i = 0; i < testData.queuedMatches.length; i++) {
            queuedMatchPromises.push(matchQueueDAO.queueMatch(testData.queuedMatches[i].match_key));
        }
        return Promise.all(queuedMatchPromises)
            .then(function (results) {
                console.log('QUEUED MATCHES: ' + results);
                testData.storeQueuedMatches(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupChallenges: function (testData) {
        testData.loadChallenges();
        var challengePromises = [];
        for (var i = 0; i < testData.challenges.length; i++) {
            challengePromises.push(challengeDAO.createChallenge(testData.challenges[i]));
        }
        return Promise.all(challengePromises)
            .then(function (results) {
                console.log('ADDED CHALLENGES: ' + results);
                testData.storeChallengeKeys(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    },

    setupOutcomes: function (testData) {
        testData.loadOutcomes();
        var outcomePromises = [];
        for (var i = 0 ; i < testData.outcomes.length; i++) {
            outcomePromises.push(outcomeDAO.createOutcome(testData.outcomes[i]));
        }
        return Promise.all(outcomePromises)
            .then(function (results) {
                console.log('ADDED OUTCOMES: ' + results);
                testData.storeOutcomeKeys(results);
                return testData;
            },
            function (err) {
                var errMsg = 'TEST SETUP FAILED: ' + err;
                console.log(errMsg);
                throw errMsg;
            });
    }
};