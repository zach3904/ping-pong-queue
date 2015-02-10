'use strict';

var matchDAO = require('../daos/MatchDAO');

module.exports = {

    name: 'matchService',

    getMatchById: function (request, response) {
        var promise = matchDAO.getMatchById(request.query.match_id);
        promise.then(function (match) {
            response.send(match);
        }, function (err) {
            console.error('Error in getMatchById: ', err);
        });
    },

    addMatch: function (request, response) {
        var promise = matchDAO.createMatch();
        promise.then(function (matchId) {
            response.send(matchId);
        }, function (err) {
            console.error('Error in addMatch: ', err);
        });
    },

    getMatchPlayers: function (request, response) {
        var promise = matchDAO.getMatchPlayers();
        promise.then(function (matchPlayers) {
            response.send(matchPlayers);
        }, function (err) {
            console.error('Error in addMatch: ', err);
        });
    },

    addMatchPlayer: function (request, response) {
        var promise = matchDAO.createMatchPlayer(request.body);
        promise.then(function (matchPlayerId) {
            response.send(matchPlayerId);
        }, function (err) {
            console.error('Error in addMatch: ', err);
        });
    }
};
