'use strict';

var singlePlayerDAO = require('../daos/SinglePlayerDAO');

module.exports = {

    name: 'singlePlayerService',

    getSinglePlayers: function (request, response) {
        var promise = singlePlayerDAO.getSinglePlayers();
        promise.then(function (singlePlayers) {
            response.send(singlePlayers);
        }, function (err) {
            console.error('Error in getSinglePlayers: ', err);
        });
    },

    getSinglePlayerById: function (request, response) {
        var promise = singlePlayerDAO.getSinglePlayerById(request.query.single_player_id);
        promise.then(function (singlePlayerById) {
            response.send(singlePlayerById);
        }, function (err) {
            console.error('Error in getSinglePlayerById: ', err);
        });
    },

    addSinglePlayer: function (request, response) {
        var promise = singlePlayerDAO.addSinglePlayer(request.query);
        promise.then(function (singlePlayerId) {
            response.send(singlePlayerId);
        }, function (err) {
            console.error('Error in addSinglePlayer: ', err);
        });
    },

    removeSinglePlayer: function (request, response) {
        var promise = singlePlayerDAO.removeSinglePlayer(request.query.single_player_id);
        promise.then(function (result) {
            response.sendStatus(200);
        }, function (err) {
            console.error('Error in removeSinglePlayer: ', err);
        });
    }
};
