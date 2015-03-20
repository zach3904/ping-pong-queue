'use strict';

var playerResource = require('../resources/PlayerResource');

module.exports = {

    name: 'playerService',

    getPlayerById: function (request, response) {
        console.log('playerService.getPlayerById');
        playerResource.getPlayerById(request.query.player_id)
            .then(function (player) {
                response.send(player);
            }, function (err) {
                console.error('Error in getPlayerById: ', err);
            });
    },

    getPlayerByAny: function (request, response) {
        console.log('playerService.getPlayerByAny');
        playerResource.getPlayerByAny(request.query)
            .then(function (players) {
                response.send(players);
            }, function (err) {
                console.error('Error in getPlayerByAny: ', err);
            });
    },

    searchPlayers: function (request, response) {
        console.log('playerService.searchPlayers');
        playerResource.searchPlayers(request.query.query)
            .then(function (matchedPlayers) {
                response.send(matchedPlayers);
            }, function (err) {
                console.error('Error in searchPlayers: ', err);
            });
    },

    addPlayer: function (request, response) {
        console.log('playerService.addPlayer');
        playerResource.addPlayer(request.body)
            .then(function (insertedPlayerId) {
                response.send(insertedPlayerId);
                //response.sendStatus(200);
            }, function (err) {
                console.error('Error in addPlayer: ', err);
            });
    },

    updatePlayer: function (request, response) {
        console.log('playerService.updatePlayer');
        playerResource.updatePlayer(request.body)
            .then(function (updatedPlayer) {
                response.send(updatedPlayer);
                //response.sendStatus(200);
            }, function (err) {
                console.error('Error in updatePlayer: ', err);
            });
    }
};
