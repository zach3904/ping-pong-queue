'use strict';

var singlePlayerResource = require('../resources/SinglePlayerResource');

module.exports = {

    name: 'singlePlayerService',

    getSinglePlayers: function (request, response) {
        console.log('singlePlayerService.getSinglePlayers');
        singlePlayerResource.getSinglePlayers()
            .then(function (singlePlayers) {
                response.send(singlePlayers);
            }, function (err) {
                console.error('Error in getSinglePlayers: ', err);
            });
    },

    getSinglePlayerById: function (request, response) {
        console.log('singlePlayerService.getSinglePlayerById');
        singlePlayerResource.getSinglePlayerById(request.query.single_player_id)
            .then(function (singlePlayerById) {
                response.send(singlePlayerById);
            }, function (err) {
                console.error('Error in getSinglePlayerById: ', err);
            });
    },

    addSinglePlayer: function (request, response) {
        console.log('singlePlayerService.addSinglePlayer');
        singlePlayerResource.addSinglePlayer(request.query)
            .then(function (singlePlayerId) {
                response.send(singlePlayerId);
            }, function (err) {
                console.error('Error in addSinglePlayer: ', err);
            });
    },

    removeSinglePlayer: function (request, response) {
        console.log('singlePlayerService.removeSinglePlayer');
        singlePlayerResource.removeSinglePlayer(request.query.single_player_id)
            .then(function () {
                response.sendStatus(200);
            }, function (err) {
                console.error('Error in removeSinglePlayer: ', err);
            });
    }
};
