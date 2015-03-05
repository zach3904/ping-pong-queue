'use strict';

var Promise = require('promise');

var db = require('../server/db.js');
var playerDAO = require('../server/daos/PlayerDAO');
var singlePlayerDAO = require('../server/daos/SinglePlayerDAO');
var matchDAO = require('../server/daos/MatchDAO');
var matchQueueDAO = require('../server/daos/MatchQueueDAO');
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
                    resolve();
                });
        });
    },

    setupPlayers: function (players) {
        var playerPromises = [];
        for (var i = 0; i < players.length; i++) {
            playerPromises.push(playerDAO.addPlayer(players[i]));
        }
        return Promise.all(playerPromises);
    },

    setupSinglePlayers: function (singlePlayers) {
        var singlePlayerPromises = [];
        for (var i = 0; i < singlePlayers.length; i++) {
            singlePlayerPromises.push(singlePlayerDAO.addSinglePlayer(singlePlayers[i]));
        }
        return Promise.all(singlePlayerPromises);
    },

    setupMatches: function (matches) {
        var matchPromises = [];
        for (var i = 0; i < matches.length; i++) {
            matchPromises.push(matchDAO.createMatch(matches[i].match_type));
        }
        return Promise.all(matchPromises);
    },

    setupQueuedMatches: function (matches) {
        var queuedMatchPromises = [];
        for (var i = 0; i < matches.length; i++) {
            queuedMatchPromises.push(matchQueueDAO.queueMatch(matches[i]));
        }
        return Promise.all(queuedMatchPromises);
    },

    setupChallenges: function (challenges) {
        var challengePromises = [];
        for (var i = 0; i < challenges.length; i++) {
            challengePromises.push(challengeDAO.createChallenge(challenges[i]));
        }
        return Promise.all(challengePromises);
    },

    setupOutcomes: function (outcomes) {
        var outcomePromises = [];
        for (var i = 0 ; i < outcomes.length; i++) {
            outcomePromises.push(outcomeDAO.createOutcome(outcomes[i]));
        }
        return Promise.all(outcomePromises);
    }
};